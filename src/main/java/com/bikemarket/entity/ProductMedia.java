package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PRODUCT_MEDIA")

public class ProductMedia {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne
  @JoinColumn(name = "ProductId", foreignKey = @ForeignKey(name = "Id"))
  private Product ProductId;

  @Column(name = "media_url")
  private String media_url;

  @Column(name = "media_type")
  private String media_type;

  @Column(name = "isThumbnail")
  private String isThumbnail;

  ProductMedia(Product product, String media_url, String media_type, String isThumbnail) {
    this.ProductId = product;
    this.media_url = media_url;
    this.media_type = media_type;
    this.isThumbnail = isThumbnail;
  }
}
