package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.BikeRequestDTO;
import com.bikemarket.dto.ProductMediaRequestDTO;
import com.bikemarket.dto.ProductMediaResponseDTO;
import com.bikemarket.dto.ProductRequestDTO;
import com.bikemarket.dto.ProductResponseDTO;
import com.bikemarket.dto.UpdateProductStatusDTO;
import com.bikemarket.entity.Bike;
import com.bikemarket.entity.Product;
import com.bikemarket.entity.ProductMedia;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SCRUM-5: Module Đăng tin & Quản lý xe (Seller/Buyer)
 *
 * Controller dành cho Seller quản lý tin đăng xe:
 *   POST   /api/seller/products             - Đăng tin sản phẩm mới
 *   POST   /api/seller/bikes                - Đăng tin xe đạp mới
 *   GET    /api/seller/{sellerId}/products  - Xem danh sách tin của mình
 *   PUT    /api/seller/products/{id}        - Cập nhật tin đăng
 *   POST   /api/seller/products/{id}/media  - Thêm media cho sản phẩm
 *   PATCH  /api/seller/products/{id}/status - Thay đổi trạng thái tin đăng
 *   DELETE /api/seller/products/{id}        - Xóa tin đăng (soft delete)
 *
 * Lưu ý: Buyer xem sản phẩm thông qua ProductViewController (/api/products/*)
 */
@RestController
@RequestMapping("/api/seller")
public class ProductManagementController {

    @Autowired
    private ProductService productService;

    // =================================================================
    // POST /api/seller/products
    // Seller tạo tin đăng sản phẩm chung
    // =================================================================
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @RequestBody ProductRequestDTO dto) {
        try {
            if (dto.getTitle() == null || dto.getTitle().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Tiêu đề tin đăng không được để trống"));
            }
            if (dto.getPrice() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Giá bán phải lớn hơn 0"));
            }

            Product product = productService.createProduct(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(toResponseDTO(product), "Đăng tin sản phẩm thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // POST /api/seller/bikes
    // Seller tạo tin đăng xe đạp (có thêm thông số kỹ thuật)
    // =================================================================
    @PostMapping("/bikes")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createBike(
            @RequestBody BikeRequestDTO dto) {
        try {
            if (dto.getTitle() == null || dto.getTitle().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Tiêu đề tin đăng không được để trống"));
            }
            if (dto.getPrice() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Giá bán phải lớn hơn 0"));
            }
            if (dto.getFrameSize() == null || dto.getFrameSize().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Kích thước khung không được để trống"));
            }

            Bike bike = productService.createBike(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(toResponseDTO(bike), "Đăng tin xe đạp thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // GET /api/seller/{sellerId}/products
    // Seller xem danh sách tin đăng của mình (có phân trang)
    // =================================================================
    @GetMapping("/{sellerId}/products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProducts(
            @PathVariable long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<Product> productsPage = productService.getSellerProducts(sellerId, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productsPage.getContent().stream()
                    .map(this::toResponseDTO)
                    .toList());
            response.put("currentPage", productsPage.getNumber());
            response.put("totalItems", productsPage.getTotalElements());
            response.put("totalPages", productsPage.getTotalPages());
            response.put("size", productsPage.getSize());

            return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách tin đăng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // PUT /api/seller/products/{productId}
    // Seller cập nhật thông tin tin đăng
    // =================================================================
    @PutMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable long productId,
            @RequestBody ProductRequestDTO dto) {
        try {
            if (dto.getSellerId() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Seller ID không hợp lệ"));
            }

            Product updated = productService.updateProduct(productId, dto);
            return ResponseEntity.ok(ApiResponse.ok(toResponseDTO(updated), "Cập nhật tin đăng thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // POST /api/seller/products/{productId}/media
    // Seller thêm media cho sản phẩm của mình
    // =================================================================
    @PostMapping("/products/{productId}/media")
    public ResponseEntity<ApiResponse<ProductMediaResponseDTO>> addProductMedia(
            @PathVariable long productId,
            @RequestBody ProductMediaRequestDTO dto) {
        try {
            ProductMedia media = productService.addProductMedia(productId, dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(toMediaResponseDTO(media), "Thêm media sản phẩm thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // GET /api/seller/products/{productId}/media
    // Seller xem media của sản phẩm
    // =================================================================
    @GetMapping("/products/{productId}/media")
    public ResponseEntity<ApiResponse<List<ProductMediaResponseDTO>>> getProductMedia(
            @PathVariable long productId) {
        try {
            List<ProductMediaResponseDTO> media = productService.getProductMedia(productId).stream()
                    .map(this::toMediaResponseDTO)
                    .toList();
            return ResponseEntity.ok(ApiResponse.ok(media, "Lấy media sản phẩm thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // DELETE /api/seller/products/{productId}/media/{mediaId}?sellerId=1
    // Seller xóa media khỏi sản phẩm của mình
    // =================================================================
    @DeleteMapping("/products/{productId}/media/{mediaId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductMedia(
            @PathVariable long productId,
            @PathVariable long mediaId,
            @RequestParam long sellerId) {
        try {
            productService.deleteProductMedia(productId, mediaId, sellerId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Xóa media sản phẩm thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // PATCH /api/seller/products/{productId}/status
    // Seller thay đổi trạng thái tin đăng (DRAFT, PUBLISHED, HIDDEN, DELETED)
    // =================================================================
    @PatchMapping("/products/{productId}/status")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProductStatus(
            @PathVariable long productId,
            @RequestBody UpdateProductStatusDTO dto) {
        try {
            if (dto.getStatus() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Trạng thái không hợp lệ"));
            }
            if (dto.getSellerId() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Seller ID không hợp lệ"));
            }

            Product updated = productService.updateProductStatus(productId, dto.getSellerId(), dto.getStatus());
            return ResponseEntity.ok(ApiResponse.ok(toResponseDTO(updated),
                    "Cập nhật trạng thái tin đăng thành công: " + dto.getStatus()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Bad Request", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // DELETE /api/seller/products/{productId}
    // Seller xóa tin đăng (soft delete - chuyển sang DELETED)
    // =================================================================
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable long productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok(ApiResponse.ok(null, "Xóa tin đăng thành công"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Not Found", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // =================================================================
    // Helper: chuyển Product entity → ProductResponseDTO
    // =================================================================
    private ProductResponseDTO toResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .price(product.getPrice())
                .total(product.getTotal())
                .conditionPercent(product.getConditionPercent())
                .status(product.getStatus().name())
                .sellerId(product.getSellerId() != null ? product.getSellerId().getId() : 0)
                .sellerName(product.getSellerId() != null ? product.getSellerId().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : 0)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : 0)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(product.getCreated_at())
                .updatedAt(product.getUpdated_at())
                .media(productService.getProductMedia(product.getId()).stream()
                        .map(this::toMediaResponseDTO)
                        .toList())
                .build();
    }

    private ProductMediaResponseDTO toMediaResponseDTO(ProductMedia media) {
        return ProductMediaResponseDTO.builder()
                .id(media.getId())
                .productId(media.getProductId() != null ? media.getProductId().getId() : 0)
                .mediaUrl(media.getMedia_url())
                .mediaType(media.getMedia_type())
                .thumbnail(Boolean.parseBoolean(media.getIsThumbnail()))
                .build();
    }
}
