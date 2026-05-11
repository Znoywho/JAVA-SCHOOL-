package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMediaResponseDTO {
    private long id;
    private long productId;
    private String mediaUrl;
    private String mediaType;
    private boolean thumbnail;
}
