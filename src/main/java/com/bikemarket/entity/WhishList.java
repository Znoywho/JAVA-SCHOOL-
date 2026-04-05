package com.bikemarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "WhishList")
public class WhishList {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "BuyerId", nullable = false, foreignKey = @ForeignKey(name = "BuyerId"))
  private User buyer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ProductId", nullable = false, foreignKey = @ForeignKey(name = "ProductId"))
  private Product product;

  public WhishList(User buyer, Product product) {
    this.buyer = buyer;
    this.product = product;
  }
}
