
package com.bikemarket.entity;

import com.bikemarket.enums.ShippingStatus;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Shipping")
public class Shipping {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "OrderId", nullable = false, foreignKey = @ForeignKey(name = "OrderId"))
  private Order order;

  @Column(name = "provider", nullable = false)
  private String provider;

  @Column(name = "tracking_code", nullable = false, unique = true)
  private String trackingCode;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ShippingStatus status;

  Shipping(Order order, String provider, String trackingCode) {
    this.order = order;
    this.provider = provider;
    this.trackingCode = trackingCode;
    this.status = ShippingStatus.PENDING;
  }
}
