package com.bikemarket.entity;


import com.bikemarket.enums.InspectorReportStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@Table(name = "InspectorReport")
public class InspectorReport {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne
  @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "Id"))
  private Product product;

  @ManyToOne
  @JoinColumn(name = "InspectorId", nullable = false)
  private User InspectorId;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime created_at;

  @Column(name = "status", nullable = false)
  private InspectorReportStatus status;

  @Column(name = "score_rating")
  private double score_rating;

  @Column(name = "report_details")
  private String report_details;

  public InspectorReport() {}

  public InspectorReport(Product product, User inspector,double score_rating, String report_details) {
    this.product = product;
    this.InspectorId = inspector;
    this.score_rating = score_rating;
    this.status = InspectorReportStatus.PENDING;
    this.report_details = report_details;
  }
}
