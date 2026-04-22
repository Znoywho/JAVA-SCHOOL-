package com.bikemarket.repository;

import com.bikemarket.entity.SellerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISellerReviewRepository extends JpaRepository<SellerReview, Long> {
    List<SellerReview> findBysellerId(long sellerId);
    
    List<SellerReview> findByBuyerId(long buyerId);
    
    Optional<SellerReview> findByOrderId(long orderId);

    @Query(value = "SELECT AVG(CASE rating WHEN 'ONE_STAR' THEN 1 WHEN 'TWO_STAR' THEN 2 WHEN 'THREE_STAR' THEN 3 WHEN 'FOUR_STAR' THEN 4 WHEN 'FIVE_STAR' THEN 5 END) FROM seller_reviews WHERE seller_id = :sellerId", nativeQuery = true)
    Double getAverageRatingBySellerId(@Param("sellerId") long sellerId);
    
    @Query("SELECT COUNT(r) FROM SellerReview r WHERE r.seller.id = :sellerId")
    long countReviewsBySellerId(@Param("sellerId") long sellerId);
    
    @Query("SELECT r FROM SellerReview r WHERE r.seller.id = :sellerId ORDER BY r.createdAt DESC")
    List<SellerReview> findRecentReviewsBySellerIdOrderByDate(@Param("sellerId") long sellerId);
}
