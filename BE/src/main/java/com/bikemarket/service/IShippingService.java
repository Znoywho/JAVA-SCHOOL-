package com.bikemarket.service;

import com.bikemarket.dto.*;
import com.bikemarket.entity.Order;
import com.bikemarket.entity.Shipping;
import com.bikemarket.enums.ShippingStatus;

import java.util.List;
import java.util.Optional;

public interface IShippingService {
    List<ShippingCompanyDTO> getAvailableCompanies(String paymentMethod);

    ShippingQuoteResponse quote(Long shippingCompanyId, double orderSubtotal, String paymentMethod);

    Shipping createShipmentForOrder(Order order, ShippingSelectionDTO selection, double orderSubtotal);

    List<ShipmentResponse> listShipments(Long shippingCompanyId, ShippingStatus status, boolean onlyCod);

    Optional<ShipmentResponse> getShipmentByOrder(Long orderId);

    ShipmentResponse updateShipmentStatus(Long shipmentId, ShippingStatus status);

    ShipmentResponse confirmCodPayment(Long shipmentId, String confirmedBy);

    void cancelShipmentForOrder(Order order);

    ShipmentResponse mapToResponse(Shipping shipping);
}
