package com.bikemarket.repository;

import com.bikemarket.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, IProductRepository {
    List<Product> findBySellerId(Long sellerId);
}