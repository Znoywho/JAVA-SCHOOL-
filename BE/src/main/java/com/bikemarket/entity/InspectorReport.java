package com.bikemarket.entity;


import com.bikemarket.enums.InspectorReportStatus;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
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


  public long getId() {
    return this.Id;
  }

  public Product getProduct() {
    return this.product;
  }

  public User getInspectorId() {
    return this.InspectorId;
  }


  public LocalDateTime getCreated_at() {
    return this.created_at;
  }


  public InspectorReportStatus getStatus() {
    return this.status;
  }


  public String getReport_details() {
    return this.report_details;
  }

  public void setStatus(InspectorReportStatus status) {
    this.status = status;
  }

  public void setReport_details(String report_details) {
    this.report_details = report_details;
  }
}
