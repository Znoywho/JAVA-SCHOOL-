package com.bikemarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "WhishList")
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

  // public WhishList(User buyer, Product product) {
  //   this.buyer = buyer;
  //   this.product = product;
  //   this.createdAt = LocalDateTime.now();
  // }
}
