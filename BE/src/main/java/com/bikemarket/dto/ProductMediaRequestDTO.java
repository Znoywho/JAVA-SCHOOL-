package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMediaRequestDTO {
    private long sellerId;
    private String mediaUrl;
    private String mediaType;
    private boolean thumbnail;
}
