package com.bikemarket.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "shipping_company")
public class ShippingCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private long id;

    @Column(name = "code", nullable = false, unique = true, length = 40)
    private String code;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "hotline", length = 30)
    private String hotline;

    @Column(name = "base_fee", nullable = false)
    private double baseFee;

    @Column(name = "insurance_percent", nullable = false)
    private double insurancePercent;

    @Column(name = "cod_fee", nullable = false)
    private double codFee;

    @Column(name = "estimated_days_min", nullable = false)
    private int estimatedDaysMin;

    @Column(name = "estimated_days_max", nullable = false)
    private int estimatedDaysMax;

    @Column(name = "supports_cod", nullable = false)
    private boolean supportsCod;

    @Column(name = "active", nullable = false)
    private boolean active;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ShippingCompany() {
    }

    public ShippingCompany(String code,
                           String name,
                           String hotline,
                           double baseFee,
                           double insurancePercent,
                           double codFee,
                           int estimatedDaysMin,
                           int estimatedDaysMax,
                           boolean supportsCod) {
        this.code = code;
        this.name = name;
        this.hotline = hotline;
        this.baseFee = baseFee;
        this.insurancePercent = insurancePercent;
        this.codFee = codFee;
        this.estimatedDaysMin = estimatedDaysMin;
        this.estimatedDaysMax = estimatedDaysMax;
        this.supportsCod = supportsCod;
        this.active = true;
    }
}
