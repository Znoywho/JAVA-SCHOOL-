package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.WishlistDTO;
import com.bikemarket.entity.WhishList;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.IWishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private IWishlistService wishlistService;

    /**
     * Add product to wishlist
     * POST /api/wishlist/{buyerId}/{productId}
     */
    @PostMapping("/{buyerId}/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> addToWishlist(
            @PathVariable long buyerId,
            @PathVariable long productId) {
        try {
            WhishList wishlist = wishlistService.addToWishlist(buyerId, productId);
            WishlistDTO dto = convertToDTO(wishlist);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(dto, "Product added to wishlist successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get wishlist by buyer ID
     * GET /api/wishlist/{buyerId}
     */
    @GetMapping("/{buyerId}")
    public ResponseEntity<ApiResponse<List<WishlistDTO>>> getWishlistByBuyerId(
            @PathVariable long buyerId) {
        try {
            List<WhishList> wishlist = wishlistService.getWishlistByBuyerId(buyerId);
            List<WishlistDTO> dtoList = wishlist.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok(dtoList, "Wishlist retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Check if product is in wishlist
     * GET /api/wishlist/{buyerId}/{productId}/check
     */
    @GetMapping("/{buyerId}/{productId}/check")
    public ResponseEntity<ApiResponse<Boolean>> isProductInWishlist(
            @PathVariable long buyerId,
            @PathVariable long productId) {
        try {
            boolean isInWishlist = wishlistService.isProductInWishlist(buyerId, productId);
            return ResponseEntity.ok(ApiResponse.ok(isInWishlist, "Check completed"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Get wishlist count
     * GET /api/wishlist/{buyerId}/count
     */
    @GetMapping("/{buyerId}/count")
    public ResponseEntity<ApiResponse<Long>> getWishlistCount(
            @PathVariable long buyerId) {
        try {
            long count = wishlistService.getWishlistCount(buyerId);
            return ResponseEntity.ok(ApiResponse.ok(count, "Wishlist count retrieved"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    /**
     * Remove product from wishlist
     * DELETE /api/wishlist/{buyerId}/{productId}
     */
    @DeleteMapping("/{buyerId}/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @PathVariable long buyerId,
            @PathVariable long productId) {
        try {
            wishlistService.removeFromWishlist(buyerId, productId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Product removed from wishlist successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        }
    }

    /**
     * Clear entire wishlist
     * DELETE /api/wishlist/{buyerId}/clear-all
     */
    @DeleteMapping("/{buyerId}/clear-all")
    public ResponseEntity<ApiResponse<Void>> clearWishlist(
            @PathVariable long buyerId) {
        try {
            wishlistService.clearWishlist(buyerId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Wishlist cleared successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    // Helper method to convert entity to DTO
    private WishlistDTO convertToDTO(WhishList wishlist) {
        return WishlistDTO.builder()
                .id(wishlist.getId())
                .buyerId(wishlist.getBuyer().getId())
                .buyerName(wishlist.getBuyer().getName())
                .productId(wishlist.getProduct().getId())
                .productTitle(wishlist.getProduct().getTitle())
                .productPrice(wishlist.getProduct().getPrice())
                .addedAt(null)  // You may need to add this field to WhishList entity
                .build();
    }
}
