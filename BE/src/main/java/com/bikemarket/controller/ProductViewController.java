package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.entity.Product;
import com.bikemarket.enums.ProductStatus;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/* 
   Product View Controller - để Buyer xem sản phẩm
   API endpoints:
   - GET /api/products/{productId} - Xem chi tiết sản phẩm
   - GET /api/products/seller/{sellerId} - Xem sản phẩm của seller
   - GET /api/products/category/{categoryId} - Xem sản phẩm theo category
   - GET /api/products/brand/{brandId} - Xem sản phẩm theo brand
   - GET /api/products/search?query=keyword - Tìm kiếm sản phẩm
   - GET /api/products - Xem tất cả sản phẩm (có phân trang)
 */
@RestController
@RequestMapping("/api/products")
public class ProductViewController {

    @Autowired
    private ProductService productService;


    /*
       Get product details
       GET /api/products/{productId}
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductById(
            @PathVariable long productId) {
        try {
            Product product = productService.findProductById(productId);

            // Only return published products
            if (product.getStatus() != ProductStatus.PUBLISHED) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Not Found", "Product not found"));
            }

            Map<String, Object> productData = new HashMap<>();
            productData.put("id", product.getId());
            productData.put("title", product.getTitle());
            productData.put("price", product.getPrice());
            productData.put("total", product.getTotal());
            productData.put("conditionPercent", product.getConditionPercent());
            productData.put("status", product.getStatus().toString());
            productData.put("sellerId", product.getSellerId().getId());
            productData.put("brand", product.getBrand() != null ? product.getBrand().getName() : null);
            productData.put("category", product.getCategory() != null ? product.getCategory().getName() : null);
            productData.put("createdAt", product.getCreated_at());

            return ResponseEntity.ok(ApiResponse.ok(productData, "Product retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    /*
       Get seller products
       GET /api/products/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSellerProducts(
            @PathVariable long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Product> productsPage = productService.getSellerProducts(sellerId, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productsPage.getContent());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Seller products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    /*
       Search products by keyword
       GET /api/products/search?query=keyword
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Map<String, Object>>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Search query cannot be empty"));
            }

            Page<Product> productsPage = productService.searchProducts(query.trim(), page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("query", query);
            response.put("products", productsPage.getContent());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Search results retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    /*
       Get products by category
       GET /api/products/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductsByCategory(
            @PathVariable long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Product> productsPage = productService.getProductsByCategory(categoryId, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("categoryId", categoryId);
            response.put("products", productsPage.getContent());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Category products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    /*
       Get products by brand
       GET /api/products/brand/{brandId}
     */
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductsByBrand(
            @PathVariable long brandId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Product> productsPage = productService.getProductsByBrand(brandId, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("brandId", brandId);
            response.put("products", productsPage.getContent());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Brand products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    /*
       Get all active products
       GET /api/products
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Product> productsPage = productService.getAllProducts(page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productsPage.getContent());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "All products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    /* 
       Get products by price range
       GET /api/products/price?minPrice=100&maxPrice=1000
     */
    @GetMapping("/price")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductsByPriceRange(
            @RequestParam double minPrice,
            @RequestParam double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (maxPrice < minPrice) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "maxPrice must be greater than minPrice"));
            }

            Page<Product> productsPage = productService.getProductsByPriceRange(minPrice, maxPrice, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("minPrice", minPrice);
            response.put("maxPrice", maxPrice);
            response.put("products", productsPage.getContent());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }
}
