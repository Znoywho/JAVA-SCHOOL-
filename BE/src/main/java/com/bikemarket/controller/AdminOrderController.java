package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.OrderResponse;
import com.bikemarket.enums.BillStatus;
import com.bikemarket.enums.OrderStatus;
import com.bikemarket.service.IOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final IOrderService orderService;

    public AdminOrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> listOrders(
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) BillStatus billStatus) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrders(paymentMethod, billStatus),
                "Admin orders retrieved successfully"
        ));
    }

    @PatchMapping("/{orderId}/bank-transfer/confirm")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmBankTransfer(
            @PathVariable Long orderId,
            @RequestParam(required = false) String confirmedBy) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.confirmBankTransfer(orderId, confirmedBy),
                "Bank transfer confirmed successfully"
        ));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.updateStatus(orderId, status),
                "Order status updated successfully"
        ));
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrderById(orderId),
                "Order cancelled successfully"
        ));
    }
}
