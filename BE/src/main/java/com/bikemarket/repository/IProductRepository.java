package com.bikemarket.repository;

import com.bikemarket.entity.Product;
import com.bikemarket.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {

    // Lấy tất cả sản phẩm của seller (theo userId)
    Page<Product> findBySellerId_Id(long sellerId, Pageable pageable);

    // Lấy sản phẩm theo trạng thái
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    // Lấy sản phẩm PUBLISHED theo category
    Page<Product> findByCategory_IdAndStatus(long categoryId, ProductStatus status, Pageable pageable);

    // Lấy sản phẩm PUBLISHED theo brand
    Page<Product> findByBrand_IdAndStatus(long brandId, ProductStatus status, Pageable pageable);

    // Tìm kiếm theo title (PUBLISHED)
    @Query("SELECT p FROM Product p WHERE LOWER(p.Title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.Status = :status")
    Page<Product> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("status") ProductStatus status, Pageable pageable);

    // Lấy sản phẩm theo khoảng giá (PUBLISHED)
    Page<Product> findByPriceBetweenAndStatus(double minPrice, double maxPrice, ProductStatus status, Pageable pageable);

    // Lấy sản phẩm của seller theo trạng thái
    List<Product> findBySellerId_IdAndStatus(long sellerId, ProductStatus status);
}
