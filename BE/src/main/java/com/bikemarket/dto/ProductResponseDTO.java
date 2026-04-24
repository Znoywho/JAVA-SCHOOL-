package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO trả về thông tin sản phẩm cho client (SCRUM-5)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {

    private long id;
    private String title;
    private double price;
    private int total;
    private double conditionPercent;
    private String status;

    private long sellerId;
    private String sellerName;

    private long brandId;
    private String brandName;

    private long categoryId;
    private String categoryName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
