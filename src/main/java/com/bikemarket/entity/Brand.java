package com.bikemarket.entity;

import java.time.LocalDateTime;
import jakarta.persistence.GenerationType;
import org.hibernate.annotations.CreationTimestamp;

import com.bikemarket.enums.ProductStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "Brand")
public class Brand {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "name")
  private String name;

}
