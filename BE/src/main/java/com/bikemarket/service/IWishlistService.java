package com.bikemarket.service;

import com.bikemarket.entity.WhishList;
import java.util.List;
import java.util.Optional;

public interface IWishlistService {
    WhishList addToWishlist(long buyerId, long productId);
    
    void removeFromWishlist(long buyerId, long productId);
    
    List<WhishList> getWishlistByBuyerId(long buyerId);
    
    Optional<WhishList> getWishlistItem(long buyerId, long productId);
    
    long getWishlistCount(long buyerId);
    
    boolean isProductInWishlist(long buyerId, long productId);
    
    void clearWishlist(long buyerId);
}
