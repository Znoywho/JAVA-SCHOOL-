package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingCompanyDTO {
    private long id;
    private String code;
    private String name;
    private String hotline;
    private double baseFee;
    private double insurancePercent;
    private double codFee;
    private int estimatedDaysMin;
    private int estimatedDaysMax;
    private boolean supportsCod;
}
