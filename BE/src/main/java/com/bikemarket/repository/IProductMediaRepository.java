package com.bikemarket.repository;

import com.bikemarket.entity.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductMediaRepository extends JpaRepository<ProductMedia, Long> {
    // Field trong ProductMedia tên là "ProductId" (chữ hoa P)
    List<ProductMedia> findByProductId_Id(long productId);
    void deleteByProductId_Id(long productId);
}
