package com.bikemarket.service;

import com.bikemarket.entity.Product;
import com.bikemarket.entity.User;
import com.bikemarket.entity.WhishList;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.IWishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WishlistService implements IWishlistService {

    @Autowired
    private IWishlistRepository wishlistRepository;

    @Autowired
    private UserService userService;
     // chờ ProductRepository / ProductService 
     // Còn fix addToWishlist
    //@Autowired
    //private ProductService productService;  //create this if not exist
    // bỏ // khi có ProductService
    @Override
    public WhishList addToWishlist(long buyerId, long productId) {
        User buyer = userService.findUserById(buyerId);
        if (buyer == null) {
            throw new ResourceNotFoundException("Buyer not found with id: " + buyerId);
        }

        // Check if already in wishlist
        Optional<WhishList> existing = wishlistRepository.findByBuyerIdAndProductId(buyerId, productId);
        if (existing.isPresent()) {
            return existing.get();
        }

        WhishList wishlist = new WhishList();
        wishlist.setBuyer(buyer);
        // Need to set product - create a Product service method or fetch from repo
        //wishlist.setProduct(product);
        
        return wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(long buyerId, long productId) {
        wishlistRepository.deleteByBuyerIdAndProductId(buyerId, productId);
    }

    @Override
    public List<WhishList> getWishlistByBuyerId(long buyerId) {
        User buyer = userService.findUserById(buyerId);
        if (buyer == null) {
            throw new ResourceNotFoundException("Buyer not found with id: " + buyerId);
        }
        return wishlistRepository.findByBuyerId(buyerId);
    }

    @Override
    public Optional<WhishList> getWishlistItem(long buyerId, long productId) {
        return wishlistRepository.findByBuyerIdAndProductId(buyerId, productId);
    }

    @Override
    public long getWishlistCount(long buyerId) {
        return wishlistRepository.countByBuyerId(buyerId);
    }

    @Override
    public boolean isProductInWishlist(long buyerId, long productId) {
        return wishlistRepository.findByBuyerIdAndProductId(buyerId, productId).isPresent();
    }

    @Override
    public void clearWishlist(long buyerId) {
        List<WhishList> wishlist = wishlistRepository.findByBuyerId(buyerId);
        wishlistRepository.deleteAll(wishlist);
    }
}
