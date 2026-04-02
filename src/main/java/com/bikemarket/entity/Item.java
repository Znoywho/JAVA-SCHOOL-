package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Item
 */
@Entity
@Table(name = "Item")
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "Cart", nullable = true, foreignKey = @ForeignKey(name = "Cart"))
  private Cart cart;

  // TODO: join column of order

  @Column(name = "Quantity")
  private int quantity;

  @Column(name = "Discount")
  private double discount;

}
