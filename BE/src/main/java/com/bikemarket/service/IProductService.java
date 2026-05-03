package com.bikemarket.service;

import com.bikemarket.dto.BikeRequestDTO;
import com.bikemarket.dto.ProductRequestDTO;
import com.bikemarket.entity.Bike;
import com.bikemarket.entity.Product;
import com.bikemarket.enums.ProductStatus;
import org.springframework.data.domain.Page;

/**
 * Interface service cho Module Đăng tin & Quản lý xe - SCRUM-5
 */
public interface IProductService {

    // ---- Seller tạo tin đăng ----

    /** Tạo tin đăng sản phẩm chung */
    Product createProduct(ProductRequestDTO dto);

    /** Tạo tin đăng xe đạp */
    Bike createBike(BikeRequestDTO dto);

    // ---- Seller cập nhật tin đăng ----

    /** Cập nhật thông tin tin đăng */
    Product updateProduct(long productId, ProductRequestDTO dto);

    /** Thay đổi trạng thái tin đăng */
    Product updateProductStatus(long productId, ProductStatus status);

    // ---- Seller xóa tin đăng ----

    /** Xóa mềm (chuyển sang DELETED) */
    void deleteProduct(long productId);

    // ---- Truy vấn ----

    /** Tìm sản phẩm theo ID (dùng bởi các service khác) */
    Product findProductById(long productId);

    /** Lấy danh sách sản phẩm của seller (có phân trang) */
    Page<Product> getSellerProducts(long sellerId, int page, int size);

    /** Lấy tất cả sản phẩm PUBLISHED (có phân trang) */
    Page<Product> getAllProducts(int page, int size);

    /** Lấy sản phẩm theo category */
    Page<Product> getProductsByCategory(long categoryId, int page, int size);

    /** Lấy sản phẩm theo brand */
    Page<Product> getProductsByBrand(long brandId, int page, int size);

    /** Tìm kiếm sản phẩm theo keyword */
    Page<Product> searchProducts(String keyword, int page, int size);

    /** Lấy sản phẩm theo khoảng giá */
    Page<Product> getProductsByPriceRange(double minPrice, double maxPrice, int page, int size);
}
