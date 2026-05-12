package com.bikemarket.controller;

import com.bikemarket.dto.*;
import com.bikemarket.enums.ShippingStatus;
import com.bikemarket.service.IShippingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private final IShippingService shippingService;

    public ShippingController(IShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<ShippingCompanyDTO>>> getCompanies(
            @RequestParam(required = false) String paymentMethod) {
        return ResponseEntity.ok(ApiResponse.ok(
                shippingService.getAvailableCompanies(paymentMethod),
                "Shipping companies retrieved successfully"
        ));
    }

    @GetMapping("/quote")
    public ResponseEntity<ApiResponse<ShippingQuoteResponse>> quote(
            @RequestParam Long shippingCompanyId,
            @RequestParam double orderSubtotal,
            @RequestParam(required = false) String paymentMethod) {
        return ResponseEntity.ok(ApiResponse.ok(
                shippingService.quote(shippingCompanyId, orderSubtotal, paymentMethod),
                "Shipping quote calculated successfully"
        ));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getByOrder(@PathVariable Long orderId) {
        return shippingService.getShipmentByOrder(orderId)
                .map(shipment -> ResponseEntity.ok(ApiResponse.ok(shipment, "Shipment retrieved successfully")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Not Found", "Shipment not found for order: " + orderId)));
    }

    @PatchMapping("/{shipmentId}/status")
    public ResponseEntity<ApiResponse<ShipmentResponse>> updateStatus(
            @PathVariable Long shipmentId,
            @RequestParam ShippingStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(
                shippingService.updateShipmentStatus(shipmentId, status),
                "Shipment status updated successfully"
        ));
    }
}
