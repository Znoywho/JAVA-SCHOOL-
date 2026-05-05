package com.bikemarket.repository;

import com.bikemarket.entity.Order;
import com.bikemarket.enums.OrderStatus;
import java.util.List;
import org.springframework.stereotype.Repository;


@Repository
public interface IOrderRepository {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findBySellerId(Long sellerId);
    List<Order> findByStatus(OrderStatus status);
}