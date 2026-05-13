package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.CreateProductReviewDTO;
import com.bikemarket.dto.ProductRatingStatsDTO;
import com.bikemarket.dto.ProductReviewDTO;
import com.bikemarket.entity.ProductReview;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.IProductReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-reviews")
public class ProductReviewController {

    @Autowired
    private IProductReviewService reviewService;

    @PostMapping("/{buyerId}/{productId}")
    public ResponseEntity<ApiResponse<ProductReviewDTO>> createReview(
            @PathVariable long buyerId,
            @PathVariable long productId,
            @RequestBody CreateProductReviewDTO createReviewDTO) {
        ProductReview review = reviewService.createReview(
                buyerId,
                productId,
                createReviewDTO.getOrderId(),
                createReviewDTO.getRating(),
                createReviewDTO.getComment()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(convertToDTO(review), "Product review created successfully"));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductReviewDTO>>> getProductReviews(@PathVariable long productId) {
        List<ProductReviewDTO> reviews = reviewService.getReviewsByProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(reviews, "Product reviews retrieved successfully"));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<ApiResponse<List<ProductReviewDTO>>> getBuyerReviews(@PathVariable long buyerId) {
        List<ProductReviewDTO> reviews = reviewService.getReviewsByBuyerId(buyerId)
                .stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(reviews, "Buyer reviews retrieved successfully"));
    }

    @GetMapping("/product/{productId}/buyer/{buyerId}")
    public ResponseEntity<ApiResponse<ProductReviewDTO>> getProductReviewByBuyer(
            @PathVariable long productId,
            @PathVariable long buyerId) {
        ProductReview review = reviewService.getReviewByProductAndBuyer(productId, buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Product review not found"));
        return ResponseEntity.ok(ApiResponse.ok(convertToDTO(review), "Product review retrieved successfully"));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ProductReviewDTO>> getReviewById(@PathVariable long reviewId) {
        ProductReview review = reviewService.getReviewById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Product review not found with id: " + reviewId));
        return ResponseEntity.ok(ApiResponse.ok(convertToDTO(review), "Product review retrieved successfully"));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ProductReviewDTO>> updateReview(
            @PathVariable long reviewId,
            @RequestBody CreateProductReviewDTO createReviewDTO) {
        ProductReview review = reviewService.updateReview(
                reviewId,
                createReviewDTO.getRating(),
                createReviewDTO.getComment()
        );
        return ResponseEntity.ok(ApiResponse.ok(convertToDTO(review), "Product review updated successfully"));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product review deleted successfully"));
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<ApiResponse<ProductRatingStatsDTO>> getProductRatingStats(@PathVariable long productId) {
        return ResponseEntity.ok(ApiResponse.ok(
                reviewService.getRatingStatsByProductId(productId),
                "Product rating statistics retrieved successfully"
        ));
    }

    private ProductReviewDTO convertToDTO(ProductReview review) {
        return ProductReviewDTO.builder()
                .id(review.getId())
                .buyerId(review.getBuyer().getId())
                .buyerName(review.getBuyer().getName())
                .productId(review.getProduct().getId())
                .productTitle(review.getProduct().getTitle())
                .orderId(review.getOrder() != null ? review.getOrder().getId() : null)
                .rating(review.getRating())
                .ratingValue(review.getRating().getValue())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
