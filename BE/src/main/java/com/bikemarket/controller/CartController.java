package com.bikemarket.controller;

import com.bikemarket.dto.AddToCartDTO;
import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.CartDTO;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private ICartService cartService;

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(@RequestBody AddToCartDTO dto) {
        try {
            CartDTO cart = cartService.addToCart(dto.getBuyerId(), dto.getProductId(), dto.getQuantity());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(cart, "Product added to cart successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        }
    }

    @GetMapping("/{buyerId}")
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@PathVariable long buyerId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(buyerId), "Cart retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    @GetMapping("/{buyerId}/count")
    public ResponseEntity<ApiResponse<Integer>> getCartCount(@PathVariable long buyerId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(cartService.getCartCount(buyerId), "Cart count retrieved"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    @PatchMapping("/{buyerId}/items/{productId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateQuantity(
            @PathVariable long buyerId,
            @PathVariable long productId,
            @RequestParam int quantity) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(
                    cartService.updateQuantity(buyerId, productId, quantity),
                    "Cart item updated successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        }
    }

    @DeleteMapping("/{buyerId}/items/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable long buyerId,
            @PathVariable long productId) {
        cartService.removeFromCart(buyerId, productId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product removed from cart successfully"));
    }

    @DeleteMapping("/{buyerId}/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@PathVariable long buyerId) {
        cartService.clearCart(buyerId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cart cleared successfully"));
    }
}
