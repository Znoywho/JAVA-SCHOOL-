package com.bikemarket.repository;

import com.bikemarket.entity.Product;
import java.util.List;

public interface IProductRepository {
    List<Product> findBySellerId(Long sellerId);
}