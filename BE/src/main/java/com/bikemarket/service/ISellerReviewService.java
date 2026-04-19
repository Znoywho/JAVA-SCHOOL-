package com.bikemarket.service;

import com.bikemarket.entity.SellerReview;
import com.bikemarket.enums.ReviewRating;
import java.util.List;
import java.util.Optional;

public interface ISellerReviewService {
    SellerReview createReview(long buyerId, long sellerId, long orderId, ReviewRating rating, String comment);
    
    Optional<SellerReview> getReviewById(long reviewId);
    
    List<SellerReview> getReviewsBysellerId(long sellerId);
    
    List<SellerReview> getReviewsByBuyerId(long buyerId);
    
    Optional<SellerReview> getReviewByOrderId(long orderId);
    
    SellerReview updateReview(long reviewId, ReviewRating rating, String comment);
    
    void deleteReview(long reviewId);
    
    Double getAverageRatingBySellerId(long sellerId);
    
    long getReviewCountBySellerId(long sellerId);
    
    List<SellerReview> getRecentReviewsBySellerIdOrderByDate(long sellerId);
}
