package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Product Media")

public class ProductMedia {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne
  @JoinColumn(name = "ProeductId", foreignKey = @ForeignKey(name = "Id"))
  private int ProductId;

  @Column(name = "media_url")
  private String media_url;

  @Column(name = "media_type")
  private String media_type;

  @Column(name = "isThumbnail")
  private String isThumbnail;

}
