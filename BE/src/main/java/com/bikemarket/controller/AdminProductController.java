package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.BikeResponseDTO;
import com.bikemarket.dto.ProductResponseDTO;
import com.bikemarket.entity.Bike;
import com.bikemarket.entity.Product;
import com.bikemarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProductsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Product> productsPage = productService.getAllProductsForAdmin(page, size);
            Page<ProductResponseDTO> productDtos = productsPage.map(this::toProductResponseDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productDtos.getContent());
            response.put("currentPage", productDtos.getNumber());
            response.put("totalItems", productDtos.getTotalElements());
            response.put("totalPages", productDtos.getTotalPages());
            response.put("size", productDtos.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Admin products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    @GetMapping("/bikes")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllBikesForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Bike> bikesPage = productService.getAllBikesForAdmin(page, size);
            Page<BikeResponseDTO> bikeDtos = bikesPage.map(this::toBikeResponseDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("bikes", bikeDtos.getContent());
            response.put("currentPage", bikeDtos.getNumber());
            response.put("totalItems", bikeDtos.getTotalElements());
            response.put("totalPages", bikeDtos.getTotalPages());
            response.put("size", bikeDtos.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Admin bikes retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    @GetMapping("/products/all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProductsForAdminNoPaging() {
        try {
            List<ProductResponseDTO> products = productService.getAllProductsForAdmin().stream()
                    .map(this::toProductResponseDTO)
                    .toList();
            Map<String, Object> response = new HashMap<>();
            response.put("products", products);
            response.put("totalItems", products.size());
            return ResponseEntity.ok(ApiResponse.ok(response, "Admin products retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    @GetMapping("/bikes/all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllBikesForAdminNoPaging() {
        try {
            List<BikeResponseDTO> bikes = productService.getAllBikesForAdmin().stream()
                    .map(this::toBikeResponseDTO)
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("bikes", bikes);
            response.put("totalItems", bikes.size());
            return ResponseEntity.ok(ApiResponse.ok(response, "Admin bikes retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    private BikeResponseDTO toBikeResponseDTO(Bike bike) {
        return BikeResponseDTO.builder()
                .id(bike.getId())
                .title(bike.getTitle())
                .price(bike.getPrice())
                .total(bike.getTotal())
                .conditionPercent(bike.getConditionPercent())
                .status(bike.getStatus() != null ? bike.getStatus().name() : null)
                .sellerId(bike.getSellerId() != null ? bike.getSellerId().getId() : 0)
                .sellerName(bike.getSellerId() != null ? bike.getSellerId().getName() : null)
                .brandId(bike.getBrand() != null ? bike.getBrand().getId() : 0)
                .brandName(bike.getBrand() != null ? bike.getBrand().getName() : null)
                .categoryId(bike.getCategory() != null ? bike.getCategory().getId() : 0)
                .categoryName(bike.getCategory() != null ? bike.getCategory().getName() : null)
                .createdAt(bike.getCreated_at())
                .updatedAt(bike.getUpdated_at())
                .frameSize(bike.getFrameSize())
                .wheelSize(bike.getWheelSize())
                .verified(bike.getIsVerified())
                .minRiderHeight(bike.getMinRiderHeight())
                .maxRiderHeight(bike.getMaxRiderHeight())
                .maxWeightCapacityKg(bike.getMaxWeightCapacityKg())
                .weightKg(bike.getWeightKg())
                .color(bike.getColor())
                .build();
    }

    private ProductResponseDTO toProductResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .price(product.getPrice())
                .total(product.getTotal())
                .conditionPercent(product.getConditionPercent())
                .status(product.getStatus() != null ? product.getStatus().name() : null)
                .sellerId(product.getSellerId() != null ? product.getSellerId().getId() : 0)
                .sellerName(product.getSellerId() != null ? product.getSellerId().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : 0)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : 0)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(product.getCreated_at())
                .updatedAt(product.getUpdated_at())
                .build();
    }
}
