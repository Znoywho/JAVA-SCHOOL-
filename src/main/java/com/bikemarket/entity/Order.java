package com.bikemarket.entity;

import com.bikemarket.enums.*;



import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "Orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "BuyerId", nullable = false, foreignKey = @ForeignKey(name = "BuyerId"))
  private User buyer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "SellerId", nullable = false, foreignKey = @ForeignKey(name = "SellerId"))
  private User seller;

  @Column(name = "total_price", nullable = false)
  private double totalPrice;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime created_at;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private OrderStatus status;

  Order(User buyer, User seller, double totalPrice) {
    this.buyer = buyer;
    this.seller = seller;
    this.totalPrice = totalPrice;
    this.created_at = LocalDateTime.now();
    this.status = OrderStatus.PENDING;
  }

  // TODO: add payment method

  public long getId() {
    return this.Id;
  }

  public User getBuyer() {
    return this.buyer;
  }

  public User getSeller() {
    return this.seller;
  }

  public double getTotalPrice() {
    return this.totalPrice;
  }

  public LocalDateTime getCreated_at() {
    return this.created_at;
  }

  public OrderStatus getOrderStatus() {
    return this.status;
  }
}
