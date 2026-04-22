package com.bikemarket.repository;

import com.bikemarket.entity.WhishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IWishlistRepository extends JpaRepository<WhishList, Long> {
    List<WhishList> findByBuyerId(long buyerId);
    
    Optional<WhishList> findByBuyerIdAndProductId(long buyerId, long productId);
    
    void deleteByBuyerIdAndProductId(long buyerId, long productId);
    
    long countByBuyerId(long buyerId);
}
