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
public class BikeResponseDTO {
    // Product fields (inherited)
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

    // Bike fields
    private String frameSize;
    private String wheelSize;
    private Boolean verified;
    private int minRiderHeight;
    private int maxRiderHeight;
    private double maxWeightCapacityKg;
    private double weightKg;
    private String color;
}
