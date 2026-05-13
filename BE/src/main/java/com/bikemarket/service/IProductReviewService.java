package com.bikemarket.service;

import com.bikemarket.dto.ProductRatingStatsDTO;
import com.bikemarket.entity.ProductReview;
import com.bikemarket.enums.ReviewRating;

import java.util.List;
import java.util.Optional;

public interface IProductReviewService {
    ProductReview createReview(long buyerId, long productId, Long orderId, ReviewRating rating, String comment);

    Optional<ProductReview> getReviewById(long reviewId);

    List<ProductReview> getReviewsByProductId(long productId);

    List<ProductReview> getReviewsByBuyerId(long buyerId);

    Optional<ProductReview> getReviewByProductAndBuyer(long productId, long buyerId);

    ProductReview updateReview(long reviewId, ReviewRating rating, String comment);

    void deleteReview(long reviewId);

    ProductRatingStatsDTO getRatingStatsByProductId(long productId);
}
