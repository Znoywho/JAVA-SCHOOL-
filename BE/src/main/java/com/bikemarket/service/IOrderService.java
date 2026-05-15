package com.bikemarket.service;

import com.bikemarket.dto.*;
import com.bikemarket.enums.BillStatus;
import com.bikemarket.enums.OrderStatus;
import java.util.List;
import com.bikemarket.entity.Order;

public interface IOrderService {
    OrderResponse createOrder(CreateOrderRequest request);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrders(String paymentMethod, BillStatus billStatus);
    List<OrderResponse> getOrdersByBuyer(Long buyerId);
    List<OrderResponse> getOrdersBySeller(Long sellerId);
    OrderResponse updateStatus(Long orderId, OrderStatus status);
    OrderResponse markAsPaid(Long orderId);
    OrderResponse confirmBankTransfer(Long orderId, String confirmedBy);
    void cancelOrder(Long orderId);
    Order findOrderById(Long orderId);
}
