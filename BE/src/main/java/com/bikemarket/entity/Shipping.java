
package com.bikemarket.entity;

import com.bikemarket.enums.ShippingStatus;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ShippingCompanyId", foreignKey = @ForeignKey(name = "ShippingCompanyId"))
  private ShippingCompany shippingCompany;

  @Column(name = "recipient_name")
  private String recipientName;

  @Column(name = "recipient_phone")
  private String recipientPhone;

  @Column(name = "shipping_address", columnDefinition = "TEXT")
  private String shippingAddress;

  @Column(name = "shipping_note", columnDefinition = "TEXT")
  private String shippingNote;

  @Column(name = "shipping_fee", nullable = false)
  private double shippingFee;

  @Column(name = "cod_amount", nullable = false)
  private double codAmount;

  @Column(name = "tracking_code", unique = true)
  private String trackingCode;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ShippingStatus status;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  public Shipping() {
  }

  public Shipping(Order order,
                  ShippingCompany shippingCompany,
                  String recipientName,
                  String recipientPhone,
                  String shippingAddress,
                  String shippingNote,
                  double shippingFee,
                  double codAmount,
                  String trackingCode) {
    this.order = order;
    this.shippingCompany = shippingCompany;
    this.recipientName = recipientName;
    this.recipientPhone = recipientPhone;
    this.shippingAddress = shippingAddress;
    this.shippingNote = shippingNote;
    this.shippingFee = shippingFee;
    this.codAmount = codAmount;
    this.trackingCode = trackingCode;
    this.status = ShippingStatus.PENDING;
  }
}
