package com.bikemarket.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bikemarket.enums.ProductStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "PRODUCT")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "Total")
  private int Total;

  @ManyToOne
  @JoinColumn(name = "SellerId", foreignKey = @ForeignKey(name = "Id"))
  private long SellerId;

  @Column(name = "Title", columnDefinition = "TEXT")
  private String Title;

  @ManyToOne
  @JoinColumn(name = "Brand", foreignKey = @ForeignKey(name = "Id"))
  private int Brand;

  @Column(name = "ConditionPercent")
  private double ConditionPercent;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProductStatus Status;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime created_at;

  @CreationTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updated_at;

  public Product(int Total, long SellerId, String Title, int Brand, double ConditionPercent) {
    this.Total = Total;
    this.SellerId = SellerId;
    this.Title = Title;
    this.Brand = Brand;
    this.ConditionPercent = ConditionPercent;
    this.created_at = LocalDateTime.now();
    this.updated_at = LocalDateTime.now();

  }
}
