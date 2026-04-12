package com.bikemarket.entity;



import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Cart")
public class Cart {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "BuyerId", nullable = false, foreignKey = @ForeignKey(name = "BuyerId"))
  private User buyer;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime created_at;

  @CreationTimestamp
  @Column(name = "updated_at", updatable = false)
  private LocalDateTime updated_at;

  Cart(User buyer) {
    this.buyer = buyer;
    this.created_at = LocalDateTime.now();
    this.updated_at = LocalDateTime.now();
  }


  public long getId() {
    return this.Id;
  }

  public User getBuyer() {
    return this.buyer;
  }

  public LocalDateTime getCreatedAt() {
    return this.created_at;
  }

  public LocalDateTime getUpdatedAt() {
    return this.updated_at;
  }

  public void setUpdatedAt() {
    this.updated_at = LocalDateTime.now();
  }
}
