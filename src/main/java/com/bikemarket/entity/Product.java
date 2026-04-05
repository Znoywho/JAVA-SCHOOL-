package com.bikemarket.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bikemarket.enums.ProductStatus;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "PRODUCT")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "Total")
  private int Total;

  // NOTE: `@ForeignKey` just helps you name the constraint of the FK
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "SellerId", nullable = false, foreignKey = @ForeignKey(name = "SellerId"))
  private User SellerId;

  @Column(name = "Title", columnDefinition = "TEXT")
  private String Title;

  @ManyToOne
  @JoinColumn(name = "BrandId", nullable = false, foreignKey = @ForeignKey(name = "BrandId"))
  private Brand brand;

  // TODO: Add category in product
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

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

  @OneToOne(mappedBy = "product")
  private InspectorReport inspectorReport;

  public Product(int Total, User SellerId, String Title, Brand brand, Category category, double ConditionPercent) {
    this.Total = Total;
    this.SellerId = SellerId;
    this.Title = Title;
    this.category = category;
    this.brand = brand;
    this.ConditionPercent = ConditionPercent;
    this.created_at = LocalDateTime.now();
    this.updated_at = LocalDateTime.now();
    this.Status = ProductStatus.DRAFT;

  }

  public long getId() {
    return Id;
  }

  public int getTotal() {
    return Total;
  }

  public User getSellerId() {
    return SellerId;
  }

  public String getTitle() {
    return Title;
  }

  public Brand getBrand() {
    return brand;
  }

  public Category getCategory() {
    return category;
  }

  public double getConditionPercent() {
    return ConditionPercent;
  }

  public ProductStatus getStatus() {
    return Status;
  }

  public LocalDateTime getCreated_at() {
    return created_at;
  }

  public void setTitle(String title) {
    Title = title;
  }

  public void setStatus(ProductStatus status) {
    Status = status;
  }

  public void setTotal(int total) {
    Total = total;
  }

  public void setSellerId(User sellerId) {
    SellerId = sellerId;
  }

  public void setBrand(Brand brand) {
    this.brand = brand;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public void setConditionPercent(double conditionPercent) {
    ConditionPercent = conditionPercent;
  }
}
