package com.bikemarket.service;

import com.bikemarket.dto.CartDTO;

public interface ICartService {
    CartDTO addToCart(long buyerId, long productId, int quantity);

    CartDTO getCart(long buyerId);

    CartDTO updateQuantity(long buyerId, long productId, int quantity);

    void removeFromCart(long buyerId, long productId);

    void clearCart(long buyerId);

    int getCartCount(long buyerId);
}
