package com.bikemarket.dto;

import com.bikemarket.enums.ReviewRating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CreateReviewDTO {
    private ReviewRating rating;
    private String comment;
}
