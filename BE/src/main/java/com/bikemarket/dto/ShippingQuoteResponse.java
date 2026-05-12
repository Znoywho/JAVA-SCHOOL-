package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingQuoteResponse {
    private long shippingCompanyId;
    private String shippingCompanyName;
    private double orderSubtotal;
    private double shippingFee;
    private double codAmount;
    private int estimatedDaysMin;
    private int estimatedDaysMax;
}
