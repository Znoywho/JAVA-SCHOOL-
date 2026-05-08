package com.bikemarket.repository;

import com.bikemarket.entity.Bike;
import com.bikemarket.entity.Product;
import com.bikemarket.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findBySellerId_Id(Long sellerId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.SellerId.Id = :sellerId")
    List<Product> findBySellerId(@Param("sellerId") Long sellerId);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByStatusAndSellerId_Id(ProductStatus status, Long sellerId, Pageable pageable);

    Page<Product> findByStatusAndSellerId_IdNot(ProductStatus status, Long sellerId, Pageable pageable);

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
    Page<Product> findByCategory_IdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);

    // Dùng bởi getProductsByBrand()
    Page<Product> findByBrand_IdAndStatus(Long brandId, ProductStatus status, Pageable pageable);

    // Dùng bởi getProductsByPriceRange()
    Page<Product> findByPriceBetweenAndStatus(double minPrice, double maxPrice, ProductStatus status, Pageable pageable);

    // Dùng bởi searchProducts()
    @Query("SELECT p FROM Product p WHERE LOWER(p.Title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.status = :status")
    Page<Product> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("status") ProductStatus status, Pageable pageable);
}