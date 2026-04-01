package com.bikemarket.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bikemarket.enums.ProductStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "Bikes")
@PrimaryKeyJoinColumn(name = "Id")
public class Bike extends Product {
  public Bike(int Total, long SellerId, String Title, int Brand, double ConditionPercent) {
    super(Total, SellerId, Title, Brand, ConditionPercent);
  }

  @Column(name = "FrameSize")
  private String FrameSize;

  @Column(name = "WheelSize")
  private String Wheelsize;

  @Column(name = "isVerified")
  private String isVerified;

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

}
