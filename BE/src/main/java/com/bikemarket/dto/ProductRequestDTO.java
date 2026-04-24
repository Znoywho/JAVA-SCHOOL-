package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dùng để Seller tạo / cập nhật tin đăng sản phẩm (SCRUM-5)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDTO {

    /** ID của Seller đăng tin */
    private long sellerId;

    /** Tiêu đề tin đăng */
    private String title;

    /** Giá bán */
    private double price;

    /** Số lượng */
    private int total;

    /** ID thương hiệu */
    private long brandId;

    /** ID danh mục */
    private long categoryId;

    /** Phần trăm tình trạng xe (0-100) */
    private double conditionPercent;
}
