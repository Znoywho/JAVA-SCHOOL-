package com.bikemarket.repository;

import com.bikemarket.entity.ProductReview;
import com.bikemarket.enums.ReviewRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductReviewRepository extends JpaRepository<ProductReview, Long> {
    @Query("SELECT r FROM ProductReview r JOIN FETCH r.buyer JOIN FETCH r.product WHERE r.product.Id = :productId ORDER BY r.createdAt DESC")
    List<ProductReview> findByProductIdOrderByCreatedAtDesc(@Param("productId") long productId);

    @Query("SELECT r FROM ProductReview r JOIN FETCH r.buyer JOIN FETCH r.product WHERE r.buyer.Id = :buyerId ORDER BY r.createdAt DESC")
    List<ProductReview> findByBuyerIdOrderByCreatedAtDesc(@Param("buyerId") long buyerId);

    @Query("SELECT r FROM ProductReview r JOIN FETCH r.buyer JOIN FETCH r.product WHERE r.product.Id = :productId AND r.buyer.Id = :buyerId")
    Optional<ProductReview> findByProductIdAndBuyerId(@Param("productId") long productId, @Param("buyerId") long buyerId);

    @Query("SELECT COUNT(r) FROM ProductReview r WHERE r.product.Id = :productId AND r.buyer.Id = :buyerId")
    long countByProductIdAndBuyerId(@Param("productId") long productId, @Param("buyerId") long buyerId);

    @Query(value = "SELECT AVG(CASE rating WHEN 'ONE_STAR' THEN 1 WHEN 'TWO_STAR' THEN 2 WHEN 'THREE_STAR' THEN 3 WHEN 'FOUR_STAR' THEN 4 WHEN 'FIVE_STAR' THEN 5 END) FROM product_reviews WHERE product_id = :productId", nativeQuery = true)
    Double getAverageRatingByProductId(@Param("productId") long productId);

    @Query("SELECT COUNT(r) FROM ProductReview r WHERE r.product.Id = :productId")
    long countReviewsByProductId(@Param("productId") long productId);

    @Query("SELECT COUNT(r) FROM ProductReview r WHERE r.product.Id = :productId AND r.rating = :rating")
    long countByProductIdAndRating(@Param("productId") long productId, @Param("rating") ReviewRating rating);
}
