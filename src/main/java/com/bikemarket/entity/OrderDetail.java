package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "OrderDetail")
public class OrderDetail {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "OrderId", nullable = false, foreignKey = @ForeignKey(name = "OrderId"))
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ProductId", nullable = false, foreignKey = @ForeignKey(name = "ProductId"))
  private Product product;

  @Column(name = "quantity", nullable = false)
  private int quantity;

  @Column(name = "price", nullable = false)
  private double price;

  OrderDetail(Order order, Product product, int quantity, double price) {
    this.order = order;
    this.product = product;
    this.quantity = quantity;
    this.price = price;
  }
}
