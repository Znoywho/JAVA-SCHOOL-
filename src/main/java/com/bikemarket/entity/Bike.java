package com.bikemarket.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bikemarket.enums.ProductStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "Bikes")
@PrimaryKeyJoinColumn(name = "Id")
public class Bike extends Product {

  @Column(name = "FrameSize")
  private String FrameSize;

  @Column(name = "WheelSize")
  private String WheelSize;

  @Column(name = "isVerified")
  private Boolean isVerified;

  @Column(name = "MinRiderHeight")
  private int MinRiderHeight;
  @Column(name = "MaxRiderHeight")
  private int MaxRiderHeight;

  @Column(name = "maxWeightCapacityKg")
  private double maxWeightCapacityKg;

  @Column(name = "weightKg")
  private double weightKg;

  @Column(name = "Color")
  private String Color;

  public Bike(int Total, Seller SellerId, String Title, Brand Brand, Category category, double ConditionPercent,
      String FrameSize, String WheelSize, boolean isVerified,
      int MinRiderHeight, int MaxRiderHeight, double maxWeightCapacityKg, double weightKg, String Color) {

    super(Total, SellerId, Title, Brand, category, ConditionPercent);

    this.FrameSize = FrameSize;
    this.WheelSize = WheelSize;
    this.isVerified = isVerified;
    this.MinRiderHeight = MinRiderHeight;
    this.MaxRiderHeight = MaxRiderHeight;
    this.maxWeightCapacityKg = maxWeightCapacityKg;
    this.weightKg = weightKg;
    this.Color = Color;
  }

}
