package com.bikemarket.repository;

import com.bikemarket.entity.Bike;
import com.bikemarket.entity.Product;
import com.bikemarket.enums.ProductStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.SellerId LEFT JOIN FETCH p.brand LEFT JOIN FETCH p.category WHERE p.SellerId.Id = :sellerId")
    Page<Product> findBySellerId_Id(@Param("sellerId") Long sellerId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.SellerId.Id = :sellerId")
    List<Product> findBySellerId(@Param("sellerId") Long sellerId);

    @EntityGraph(attributePaths = {"SellerId", "brand", "category"})
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.status = :status AND p.SellerId.Id = :sellerId",
           countQuery = "SELECT COUNT(p) FROM Product p WHERE p.status = :status AND p.SellerId.Id = :sellerId")
    Page<Product> findByStatusAndSellerId_Id(@Param("status") ProductStatus status, @Param("sellerId") Long sellerId, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.status = :status AND p.SellerId.Id <> :sellerId",
           countQuery = "SELECT COUNT(p) FROM Product p WHERE p.status = :status AND p.SellerId.Id <> :sellerId")
    Page<Product> findByStatusAndSellerId_IdNot(@Param("status") ProductStatus status, @Param("sellerId") Long sellerId, Pageable pageable);

    @Query(
            value = "SELECT b FROM Bike b " +
                    "LEFT JOIN b.SellerId s " +
                    "LEFT JOIN b.brand br " +
                    "LEFT JOIN b.category c",
            countQuery = "SELECT COUNT(b) FROM Bike b"
    )
    Page<Bike> findAllBikesWithProductInfo(Pageable pageable);

    @Query("SELECT b FROM Bike b LEFT JOIN b.SellerId s LEFT JOIN b.brand br LEFT JOIN b.category c")
    List<Bike> findAllBikesWithProductInfo();

    // Dùng bởi getProductsByCategory()
    @EntityGraph(attributePaths = {"SellerId", "brand", "category"})
    Page<Product> findByCategory_IdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);

    // Dùng bởi getProductsByBrand()
    @EntityGraph(attributePaths = {"SellerId", "brand", "category"})
    Page<Product> findByBrand_IdAndStatus(Long brandId, ProductStatus status, Pageable pageable);

    // Dùng bởi getProductsByPriceRange()
    @Query(value = "SELECT p FROM Product p LEFT JOIN FETCH p.SellerId LEFT JOIN FETCH p.brand LEFT JOIN FETCH p.category WHERE p.Price BETWEEN :minPrice AND :maxPrice AND p.status = :status",
           countQuery = "SELECT COUNT(p) FROM Product p WHERE p.Price BETWEEN :minPrice AND :maxPrice AND p.status = :status")
    Page<Product> findByPriceBetweenAndStatus(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice, @Param("status") ProductStatus status, Pageable pageable);

    // Dùng bởi searchProducts()
    @Query("SELECT p FROM Product p WHERE LOWER(p.Title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.status = :status")
    @EntityGraph(attributePaths = {"SellerId", "brand", "category"})
    Page<Product> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("status") ProductStatus status, Pageable pageable);
}