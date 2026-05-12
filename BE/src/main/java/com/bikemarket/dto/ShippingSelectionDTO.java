package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingSelectionDTO {
    private Long shippingCompanyId;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String shippingNote;
}
