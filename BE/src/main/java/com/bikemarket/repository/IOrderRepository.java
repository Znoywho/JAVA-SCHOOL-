package com.bikemarket.repository;

import com.bikemarket.entity.Order;
import com.bikemarket.enums.OrderStatus;
import java.util.List;

public interface IOrderRepository {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findBySellerId(Long sellerId);
    List<Order> findByStatus(OrderStatus status);
}