package com.bikemarket.service;

import com.bikemarket.dto.*;
import com.bikemarket.entity.*;
import com.bikemarket.enums.BillStatus;
import com.bikemarket.enums.OrderStatus;
import com.bikemarket.repository.OrderRepository;
import com.bikemarket.repository.UserRepository;
import com.bikemarket.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final IShippingService shippingService;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        IShippingService shippingService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.shippingService = shippingService;
    }

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng phải có ít nhất một sản phẩm");
        }

        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("Buyer không tồn tại: " + request.getBuyerId()));
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("Seller không tồn tại: " + request.getSellerId()));

        Order order = new Order(buyer, seller, 0, request.getPaymentMethod());

        double total = 0;
        for (OrderDetailRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại: " + item.getProductId()));

            if (product.getSellerId().getId() != seller.getId()) {
                throw new IllegalArgumentException("Sản phẩm '" + product.getTitle() + "' không thuộc seller đã chọn");
            }

            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Số lượng sản phẩm phải lớn hơn 0");
            }

            if (product.getTotal() < item.getQuantity()) {
                throw new IllegalArgumentException("Sản phẩm '" + product.getTitle() + "' không đủ số lượng");
            }

            product.setTotal(product.getTotal() - item.getQuantity());
            productRepository.save(product);

            double productPrice = product.getPrice();
            OrderDetail detail = new OrderDetail(order, product, item.getQuantity(), productPrice);
            order.addOrderDetail(detail);
            total += productPrice * item.getQuantity();
        }

        ShippingQuoteResponse quote = shippingService.quote(
                request.getShipping() != null ? request.getShipping().getShippingCompanyId() : null,
                total,
                request.getPaymentMethod()
        );

        order.setTotalPrice(total + quote.getShippingFee());
        Order savedOrder = orderRepository.save(order);
        shippingService.createShipmentForOrder(savedOrder, request.getShipping(), total);

        return mapToResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + id));
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String paymentMethod, BillStatus billStatus) {
        return orderRepository.findAll()
                .stream()
                .filter(order -> paymentMethod == null || paymentMethod.isBlank()
                        || paymentMethod.equalsIgnoreCase(order.getPaymentMethod()))
                .filter(order -> billStatus == null || order.getBillStatus() == billStatus)
                .sorted(Comparator.comparing(Order::getCreated_at, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersBySeller(Long sellerId) {
        return orderRepository.findBySellerId(sellerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));
        order.setStatus(status);
        return mapToResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse markAsPaid(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Không thể thanh toán đơn đã hủy");
        }

        if (isBankTransfer(order.getPaymentMethod())) {
            throw new IllegalArgumentException("Don chuyen khoan can admin xac nhan thanh toan");
        }

        return markOrderAsPaid(order, "Online payment");
    }

    @Override
    public OrderResponse confirmBankTransfer(Long orderId, String confirmedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order khong ton tai: " + orderId));

        if (!isBankTransfer(order.getPaymentMethod())) {
            throw new IllegalArgumentException("Chi don chuyen khoan ngan hang moi can admin xac nhan");
        }

        return markOrderAsPaid(order, isBlank(confirmedBy) ? "Admin" : confirmedBy.trim());
    }

    @Override
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));

        if (order.getOrderStatus() == OrderStatus.SHIPPING ||
                order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Không thể hủy đơn đang giao hoặc đã giao");
        }

        for (OrderDetail detail : order.getOrderDetails()) {
            Product product = detail.getProduct();
            product.setTotal(product.getTotal() + detail.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setBillStatus(BillStatus.CANCELLED);
        shippingService.cancelShipmentForOrder(order);
        orderRepository.save(order);
    }

    private OrderResponse markOrderAsPaid(Order order, String confirmedBy) {
        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Khong the thanh toan don da huy");
        }
        if (order.getBillStatus() == BillStatus.PAID) {
            return mapToResponse(order);
        }

        order.setBillStatus(BillStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentConfirmedAt(LocalDateTime.now());
        order.setPaymentConfirmedBy(confirmedBy);

        Order savedOrder = orderRepository.save(order);
        shippingService.releaseShipmentForOrder(savedOrder);
        return mapToResponse(savedOrder);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setBuyerId(order.getBuyer().getId());
        res.setBuyerName(order.getBuyer().getName());
        res.setSellerId(order.getSeller().getId());
        res.setSellerName(order.getSeller().getName());
        res.setTotalPrice(order.getTotalPrice());
        res.setOrderStatus(order.getOrderStatus().name());
        res.setBillStatus(order.getBillStatus().name());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setCreatedAt(order.getCreated_at());
        res.setPaymentConfirmedAt(order.getPaymentConfirmedAt());
        res.setPaymentConfirmedBy(order.getPaymentConfirmedBy());

        List<OrderDetailResponse> items = order.getOrderDetails().stream().map(d -> {
            OrderDetailResponse dr = new OrderDetailResponse();
            dr.setId(d.getId());
            dr.setProductId(d.getProduct().getId());
            dr.setProductTitle(d.getProduct().getTitle());
            dr.setQuantity(d.getQuantity());
            dr.setPrice(d.getPrice());
            dr.setSubtotal(d.getPrice() * d.getQuantity());
            return dr;
        }).collect(Collectors.toList());

        res.setItems(items);
        double productTotal = items.stream().mapToDouble(OrderDetailResponse::getSubtotal).sum();
        res.setProductTotal(productTotal);
        res.setShippingFee(Math.max(0, order.getTotalPrice() - productTotal));
        shippingService.getShipmentByOrder(order.getId()).ifPresent(res::setShipment);
        return res;
    }

    private boolean isBankTransfer(String paymentMethod) {
        return paymentMethod != null && paymentMethod.toUpperCase(Locale.ROOT).equals("BANK_TRANSFER");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    @Override
    public Order findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));
    }
}
