package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "InspectorReport")
public class InspectorReport {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne
  @JoinColumn(name = "BikeId", foreignKey = @ForeignKey(name = "Id"))
  private long BikeId;

  @ManyToOne
  @JoinColumn(name = "InspectorId", nullable = false)
  private long InspectorId;

}
