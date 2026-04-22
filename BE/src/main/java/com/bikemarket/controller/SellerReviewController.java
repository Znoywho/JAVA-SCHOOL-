package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.CreateReviewDTO;
import com.bikemarket.dto.SellerReviewDTO;
import com.bikemarket.dto.SellerRatingStatsDTO;
import com.bikemarket.entity.SellerReview;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.ISellerReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class SellerReviewController {

    @Autowired
    private ISellerReviewService reviewService;

    /**
     * Create review for seller
     * POST /api/reviews/{buyerId}/{sellerId}/{orderId}
     */
    @PostMapping("/{buyerId}/{sellerId}/{orderId}")
    public ResponseEntity<ApiResponse<SellerReviewDTO>> createReview(
            @PathVariable long buyerId,
            @PathVariable long sellerId,
            @PathVariable long orderId,
            @RequestBody CreateReviewDTO createReviewDTO) {
        try {
            SellerReview review = reviewService.createReview(buyerId, sellerId, orderId,
                    createReviewDTO.getRating(), createReviewDTO.getComment());
            SellerReviewDTO dto = convertToDTO(review);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(dto, "Review created successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get all reviews for a seller
     * GET /api/reviews/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ApiResponse<List<SellerReviewDTO>>> getSellerReviews(
            @PathVariable long sellerId) {
        try {
            List<SellerReview> reviews = reviewService.getReviewsBysellerId(sellerId);
            List<SellerReviewDTO> dtoList = reviews.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Reviews retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get all reviews by a buyer
     * GET /api/reviews/buyer/{buyerId}
     */
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<ApiResponse<List<SellerReviewDTO>>> getBuyerReviews(
            @PathVariable long buyerId) {
        try {
            List<SellerReview> reviews = reviewService.getReviewsByBuyerId(buyerId);
            List<SellerReviewDTO> dtoList = reviews.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Reviews retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get review by ID
     * GET /api/reviews/{reviewId}
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<SellerReviewDTO>> getReviewById(
            @PathVariable long reviewId) {
        try {
            SellerReview review = reviewService.getReviewById(reviewId)
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
            SellerReviewDTO dto = convertToDTO(review);
            return ResponseEntity.ok(ApiResponse.ok(dto, "Review retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get review by order ID
     * GET /api/reviews/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<SellerReviewDTO>> getReviewByOrderId(
            @PathVariable long orderId) {
        try {
            SellerReview review = reviewService.getReviewByOrderId(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found for order: " + orderId));
            SellerReviewDTO dto = convertToDTO(review);
            return ResponseEntity.ok(ApiResponse.ok(dto, "Review retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Update review
     * PUT /api/reviews/{reviewId}
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<SellerReviewDTO>> updateReview(
            @PathVariable long reviewId,
            @RequestBody CreateReviewDTO createReviewDTO) {
        try {
            SellerReview review = reviewService.updateReview(reviewId,
                    createReviewDTO.getRating(), createReviewDTO.getComment());
            SellerReviewDTO dto = convertToDTO(review);
            return ResponseEntity.ok(ApiResponse.ok(dto, "Review updated successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Delete review
     * DELETE /api/reviews/{reviewId}
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Review deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get seller rating statistics
     * GET /api/reviews/seller/{sellerId}/stats
     */
    @GetMapping("/seller/{sellerId}/stats")
    public ResponseEntity<ApiResponse<SellerRatingStatsDTO>> getSellerRatingStats(
            @PathVariable long sellerId) {
        try {
            Double averageRating = reviewService.getAverageRatingBySellerId(sellerId);
            long totalReviews = reviewService.getReviewCountBySellerId(sellerId);

            SellerRatingStatsDTO stats = SellerRatingStatsDTO.builder()
                    .sellerId(sellerId)
                    .averageRating(averageRating != null ? averageRating : 0.0)
                    .totalReviews(totalReviews)
                    .build();

            return ResponseEntity.ok(ApiResponse.ok(stats, "Rating statistics retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get recent reviews
     * GET /api/reviews/seller/{sellerId}/recent
     */
    @GetMapping("/seller/{sellerId}/recent")
    public ResponseEntity<ApiResponse<List<SellerReviewDTO>>> getRecentReviews(
            @PathVariable long sellerId) {
        try {
            List<SellerReview> reviews = reviewService.getRecentReviewsBySellerIdOrderByDate(sellerId);
            List<SellerReviewDTO> dtoList = reviews.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Recent reviews retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    // Helper method
    private SellerReviewDTO convertToDTO(SellerReview review) {
        return SellerReviewDTO.builder()
                .id(review.getId())
                .buyerId(review.getBuyer().getId())
                .buyerName(review.getBuyer().getName())
                .sellerId(review.getSeller().getId())
                .sellerName(review.getSeller().getName())
                .orderId(review.getOrder().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
