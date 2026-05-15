package com.bikemarket.service;

import com.bikemarket.dto.*;
import com.bikemarket.entity.Order;
import com.bikemarket.entity.Shipping;
import com.bikemarket.entity.ShippingCompany;
import com.bikemarket.enums.BillStatus;
import com.bikemarket.enums.OrderStatus;
import com.bikemarket.enums.ShippingStatus;
import com.bikemarket.repository.IShippingCompanyRepository;
import com.bikemarket.repository.IShippingRepository;
import com.bikemarket.repository.OrderRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@Transactional
public class ShippingService implements IShippingService {

    private final IShippingCompanyRepository shippingCompanyRepository;
    private final IShippingRepository shippingRepository;
    private final OrderRepository orderRepository;

    public ShippingService(IShippingCompanyRepository shippingCompanyRepository,
                           IShippingRepository shippingRepository,
                           OrderRepository orderRepository) {
        this.shippingCompanyRepository = shippingCompanyRepository;
        this.shippingRepository = shippingRepository;
        this.orderRepository = orderRepository;
    }

    @PostConstruct
    public void seedDefaultCompanies() {
        if (shippingCompanyRepository.count() > 0) {
            return;
        }

        shippingCompanyRepository.saveAll(List.of(
                new ShippingCompany("DIRECT_HANDOFF", "Seller tự giao / hẹn nhận trực tiếp", "", 0, 0, 0, 0, 1, true),
                new ShippingCompany("GHTK", "Giao Hàng Tiết Kiệm", "1900 6092", 30000, 0.0025, 10000, 2, 4, true),
                new ShippingCompany("GHN", "Giao Hàng Nhanh", "1900 636677", 35000, 0.003, 12000, 1, 3, true),
                new ShippingCompany("VIETTEL_POST", "Viettel Post", "1900 8095", 42000, 0.0035, 15000, 2, 5, true)
        ));
    }

    @Override
    public List<ShippingCompanyDTO> getAvailableCompanies(String paymentMethod) {
        boolean cod = isCod(paymentMethod);

        return shippingCompanyRepository.findByActiveTrueOrderByBaseFeeAsc()
                .stream()
                .filter(company -> !cod || company.isSupportsCod())
                .map(this::mapCompany)
                .toList();
    }

    @Override
    public ShippingQuoteResponse quote(Long shippingCompanyId, double orderSubtotal, String paymentMethod) {
        ShippingCompany company = findAvailableCompany(shippingCompanyId, paymentMethod);
        double shippingFee = calculateFee(company, orderSubtotal, paymentMethod);
        double codAmount = isCod(paymentMethod) ? orderSubtotal + shippingFee : 0;

        return ShippingQuoteResponse.builder()
                .shippingCompanyId(company.getId())
                .shippingCompanyName(company.getName())
                .orderSubtotal(orderSubtotal)
                .shippingFee(shippingFee)
                .codAmount(codAmount)
                .estimatedDaysMin(company.getEstimatedDaysMin())
                .estimatedDaysMax(company.getEstimatedDaysMax())
                .build();
    }

    @Override
    public Shipping createShipmentForOrder(Order order, ShippingSelectionDTO selection, double orderSubtotal) {
        if (selection == null) {
            throw new IllegalArgumentException("Vui lòng chọn thông tin giao hàng");
        }
        if (selection.getShippingCompanyId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn đơn vị vận chuyển");
        }
        if (isBlank(selection.getShippingAddress())) {
            throw new IllegalArgumentException("Vui lòng nhập địa chỉ nhận hàng");
        }

        ShippingCompany company = findAvailableCompany(selection.getShippingCompanyId(), order.getPaymentMethod());
        ShippingQuoteResponse quote = quote(company.getId(), orderSubtotal, order.getPaymentMethod());

        String recipientName = isBlank(selection.getRecipientName())
                ? order.getBuyer().getName()
                : selection.getRecipientName().trim();
        String recipientPhone = isBlank(selection.getRecipientPhone())
                ? order.getBuyer().getPhone()
                : selection.getRecipientPhone().trim();

        if (isBlank(recipientPhone)) {
            throw new IllegalArgumentException("Vui lòng nhập số điện thoại nhận hàng");
        }

        Shipping shipping = new Shipping(
                order,
                company,
                recipientName,
                recipientPhone,
                selection.getShippingAddress().trim(),
                normalizeOptional(selection.getShippingNote()),
                quote.getShippingFee(),
                quote.getCodAmount(),
                generateTrackingCode(order, company)
        );

        return shippingRepository.save(shipping);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentResponse> listShipments(Long shippingCompanyId, ShippingStatus status, boolean onlyCod) {
        List<Shipping> shipments;
        if (shippingCompanyId != null && status != null) {
            shipments = shippingRepository.findByShippingCompanyIdAndStatusOrderByCreatedAtDesc(shippingCompanyId, status);
        } else if (shippingCompanyId != null) {
            shipments = shippingRepository.findByShippingCompanyIdOrderByCreatedAtDesc(shippingCompanyId);
        } else if (status != null) {
            shipments = shippingRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            shipments = shippingRepository.findAllByOrderByCreatedAtDesc();
        }

        return shipments.stream()
                .filter(shipping -> !onlyCod || isCod(shipping.getOrder().getPaymentMethod()))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ShipmentResponse> getShipmentByOrder(Long orderId) {
        return shippingRepository.findByOrderId(orderId).map(this::mapToResponse);
    }

    @Override
    public ShipmentResponse updateShipmentStatus(Long shipmentId, ShippingStatus status) {
        Shipping shipping = shippingRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment không tồn tại: " + shipmentId));

        shipping.setStatus(status);
        syncOrderStatus(shipping);

        return mapToResponse(shippingRepository.save(shipping));
    }

    @Override
    public ShipmentResponse confirmCodPayment(Long shipmentId, String confirmedBy) {
        Shipping shipping = shippingRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment không tồn tại: " + shipmentId));

        Order order = shipping.getOrder();
        if (!isCod(order.getPaymentMethod())) {
            throw new IllegalArgumentException("Chỉ đơn COD mới cần đơn vị vận chuyển xác nhận thu tiền");
        }
        if (shipping.getStatus() == ShippingStatus.CANCELLED || shipping.getStatus() == ShippingStatus.RETURNED) {
            throw new IllegalArgumentException("Không thể xác nhận thanh toán cho vận đơn đã hủy hoặc hoàn trả");
        }

        shipping.setStatus(ShippingStatus.DELIVERED);
        shipping.setCodPaymentConfirmed(true);
        shipping.setCodPaymentConfirmedAt(LocalDateTime.now());
        shipping.setCodPaymentConfirmedBy(isBlank(confirmedBy) ? "Đơn vị vận chuyển" : confirmedBy.trim());

        order.setStatus(OrderStatus.DELIVERED);
        order.setBillStatus(BillStatus.PAID);
        orderRepository.save(order);

        return mapToResponse(shippingRepository.save(shipping));
    }

    @Override
    public void cancelShipmentForOrder(Order order) {
        shippingRepository.findByOrderId(order.getId()).ifPresent(shipping -> {
            shipping.setStatus(ShippingStatus.CANCELLED);
            shippingRepository.save(shipping);
        });
    }

    @Override
    public ShipmentResponse mapToResponse(Shipping shipping) {
        ShippingCompany company = shipping.getShippingCompany();

        return ShipmentResponse.builder()
                .id(shipping.getId())
                .orderId(shipping.getOrder().getId())
                .shippingCompanyId(company != null ? company.getId() : 0)
                .shippingCompanyName(company != null ? company.getName() : "")
                .recipientName(shipping.getRecipientName())
                .recipientPhone(shipping.getRecipientPhone())
                .shippingAddress(shipping.getShippingAddress())
                .shippingNote(shipping.getShippingNote())
                .shippingFee(shipping.getShippingFee())
                .codAmount(shipping.getCodAmount())
                .trackingCode(shipping.getTrackingCode())
                .status(shipping.getStatus().name())
                .codPaymentConfirmed(shipping.isCodPaymentConfirmed())
                .codPaymentConfirmedAt(shipping.getCodPaymentConfirmedAt())
                .codPaymentConfirmedBy(shipping.getCodPaymentConfirmedBy())
                .orderBillStatus(shipping.getOrder().getBillStatus().name())
                .paymentMethod(shipping.getOrder().getPaymentMethod())
                .orderTotalPrice(shipping.getOrder().getTotalPrice())
                .buyerName(shipping.getOrder().getBuyer().getName())
                .sellerName(shipping.getOrder().getSeller().getName())
                .createdAt(shipping.getCreatedAt())
                .updatedAt(shipping.getUpdatedAt())
                .build();
    }

    private ShippingCompany findAvailableCompany(Long shippingCompanyId, String paymentMethod) {
        if (shippingCompanyId == null) {
            throw new IllegalArgumentException("Vui lòng chọn đơn vị vận chuyển");
        }

        ShippingCompany company = shippingCompanyRepository.findById(shippingCompanyId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn vị vận chuyển không tồn tại: " + shippingCompanyId));

        if (!company.isActive()) {
            throw new IllegalArgumentException("Đơn vị vận chuyển đang tạm ngưng");
        }
        if (isCod(paymentMethod) && !company.isSupportsCod()) {
            throw new IllegalArgumentException("Đơn vị vận chuyển này chưa hỗ trợ COD");
        }

        return company;
    }

    private ShippingCompanyDTO mapCompany(ShippingCompany company) {
        return ShippingCompanyDTO.builder()
                .id(company.getId())
                .code(company.getCode())
                .name(company.getName())
                .hotline(company.getHotline())
                .baseFee(company.getBaseFee())
                .insurancePercent(company.getInsurancePercent())
                .codFee(company.getCodFee())
                .estimatedDaysMin(company.getEstimatedDaysMin())
                .estimatedDaysMax(company.getEstimatedDaysMax())
                .supportsCod(company.isSupportsCod())
                .build();
    }

    private double calculateFee(ShippingCompany company, double orderSubtotal, String paymentMethod) {
        double rawFee = company.getBaseFee() + (orderSubtotal * company.getInsurancePercent());
        if (isCod(paymentMethod)) {
            rawFee += company.getCodFee();
        }

        return Math.ceil(rawFee / 1000.0) * 1000.0;
    }

    private void syncOrderStatus(Shipping shipping) {
        Order order = shipping.getOrder();
        ShippingStatus status = shipping.getStatus();

        if (status == ShippingStatus.AWAITING_PICKUP || status == ShippingStatus.PICKED_UP
                || status == ShippingStatus.IN_TRANSIT || status == ShippingStatus.OUT_FOR_DELIVERY) {
            order.setStatus(OrderStatus.SHIPPING);
        }
        if (status == ShippingStatus.DELIVERED) {
            order.setStatus(OrderStatus.DELIVERED);
        }
        if (status == ShippingStatus.CANCELLED) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setBillStatus(BillStatus.CANCELLED);
        }

        orderRepository.save(order);
    }

    private boolean isCod(String paymentMethod) {
        return paymentMethod != null && paymentMethod.toUpperCase(Locale.ROOT).equals("COD");
    }

    private String generateTrackingCode(Order order, ShippingCompany company) {
        return "RB" + order.getId() + "-" + company.getCode() + "-" + System.currentTimeMillis();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalizeOptional(String value) {
        return isBlank(value) ? null : value.trim();
    }
}
