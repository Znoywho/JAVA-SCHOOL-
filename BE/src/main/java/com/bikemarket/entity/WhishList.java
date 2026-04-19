package com.bikemarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "WhishList")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhishList {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "BuyerId", nullable = false, foreignKey = @ForeignKey(name = "BuyerId"))
  private User buyer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ProductId", nullable = false, foreignKey = @ForeignKey(name = "ProductId"))
  private Product product;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  public WhishList(User buyer, Product product) {
    this.buyer = buyer;
    this.product = product;
    this.createdAt = LocalDateTime.now();
  }
}
