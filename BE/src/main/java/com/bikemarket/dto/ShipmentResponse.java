package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentResponse {
    private long id;
    private long orderId;
    private long shippingCompanyId;
    private String shippingCompanyName;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String shippingNote;
    private double shippingFee;
    private double codAmount;
    private String trackingCode;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
