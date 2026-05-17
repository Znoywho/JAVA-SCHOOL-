package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.BikeResponseDTO;
import com.bikemarket.dto.ProductResponseDTO;
import com.bikemarket.entity.Bike;
import com.bikemarket.entity.InspectorReport;
import com.bikemarket.entity.Product;
import com.bikemarket.enums.InspectorReportStatus;
import com.bikemarket.enums.ProductStatus;
import com.bikemarket.service.InspectorReportService;
import com.bikemarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private InspectorReportService inspectorReportService;

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

    // ========== Admin Product Status Management ==========

    @PatchMapping("/products/{id}/status")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProductStatusByAdmin(
            @PathVariable long id,
            @RequestParam String status) {
        try {
            ProductStatus productStatus = ProductStatus.valueOf(status);
            Product product = productService.findProductById(id);
            product.setStatus(productStatus);
            Product saved = productService.adminSaveProduct(product);
            return ResponseEntity.ok(ApiResponse.ok(toProductResponseDTO(saved), "Product status updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid status", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProductByAdmin(@PathVariable long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // ========== Admin Inspector Report Management ==========

    @GetMapping("/inspector-reports")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllInspectorReportsForAdmin() {
        try {
            List<Map<String, Object>> reports = inspectorReportService.getAllInspectorReports().stream()
                    .map(this::toReportResponse)
                    .toList();
            return ResponseEntity.ok(ApiResponse.ok(reports, "Inspector reports retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    @PatchMapping("/inspector-reports/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateReportStatusByAdmin(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            InspectorReportStatus reportStatus = InspectorReportStatus.valueOf(status);
            InspectorReport report = inspectorReportService.getInspectorReportById(id);
            report.setStatus(reportStatus);
            InspectorReport saved = inspectorReportService.createInspectorReport(report);
            return ResponseEntity.ok(ApiResponse.ok(toReportResponse(saved), "Report status updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid status", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    @DeleteMapping("/inspector-reports/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReportByAdmin(@PathVariable Long id) {
        try {
            inspectorReportService.deleteInspectorReport(id);
            return ResponseEntity.ok(ApiResponse.ok(null, "Inspector report deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // ========== DTO Converters ==========

    private Map<String, Object> toReportResponse(InspectorReport report) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", report.getId());
        data.put("productId", report.getProduct() != null ? report.getProduct().getId() : null);
        data.put("productTitle", report.getProduct() != null ? report.getProduct().getTitle() : null);
        data.put("inspectorId", report.getInspectorId() != null ? report.getInspectorId().getId() : null);
        data.put("inspectorName", report.getInspectorId() != null ? report.getInspectorId().getName() : null);
        data.put("createdAt", report.getCreated_at());
        data.put("status", report.getStatus() != null ? report.getStatus().name() : null);
        data.put("scoreRating", report.getScore_rating());
        data.put("reportDetails", report.getReport_details());
        return data;
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
