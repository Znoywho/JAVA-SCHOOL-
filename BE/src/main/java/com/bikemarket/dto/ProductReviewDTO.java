package com.bikemarket.dto;

import com.bikemarket.enums.ReviewRating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProductReviewDTO {
    private long id;
    private long buyerId;
    private String buyerName;
    private long productId;
    private String productTitle;
    private Long orderId;
    private ReviewRating rating;
    private int ratingValue;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
