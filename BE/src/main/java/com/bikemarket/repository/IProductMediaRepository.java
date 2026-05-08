package com.bikemarket.repository;

import com.bikemarket.entity.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface IProductMediaRepository extends JpaRepository<ProductMedia, Long> {
    // Field trong ProductMedia tên là "ProductId" (chữ hoa P)
    @Query("SELECT pm FROM ProductMedia pm WHERE pm.ProductId.Id = :productId")
    List<ProductMedia> findByProductId_Id(@Param("productId") long productId);

    @Query("DELETE FROM ProductMedia pm WHERE pm.ProductId.Id = :productId")
    void deleteByProductId_Id(@Param("productId") long productId);
}
