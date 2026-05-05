package com.bikemarket.service;

import com.bikemarket.dto.*;
import com.bikemarket.enums.OrderStatus;
import java.util.List;
import com.bikemarket.entity.Order;

public interface IOrderService {
    OrderResponse createOrder(CreateOrderRequest request);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrdersByBuyer(Long buyerId);
    List<OrderResponse> getOrdersBySeller(Long sellerId);
    OrderResponse updateStatus(Long orderId, OrderStatus status);
    OrderResponse markAsPaid(Long orderId);
    void cancelOrder(Long orderId);
    Order findOrderById(Long orderId);
}