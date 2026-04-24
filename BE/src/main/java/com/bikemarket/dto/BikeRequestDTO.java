package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dùng để Seller tạo / cập nhật tin đăng xe đạp (SCRUM-5)
 * Kế thừa thông tin chung từ ProductRequestDTO + thêm thông tin riêng của xe đạp
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BikeRequestDTO {

    // ---- Thông tin chung (Product) ----
    private long sellerId;
    private String title;
    private double price;
    private int total;
    private long brandId;
    private long categoryId;
    private double conditionPercent;

    // ---- Thông tin riêng của xe đạp (Bike) ----

    /** Kích thước khung (e.g. "M", "L", "XL", "52cm") */
    private String frameSize;

    /** Kích thước bánh (e.g. "26\"", "27.5\"", "29\"") */
    private String wheelSize;

    /** Đã được kiểm định chưa */
    private boolean verified;

    /** Chiều cao tối thiểu của người đi (cm) */
    private int minRiderHeight;

    /** Chiều cao tối đa của người đi (cm) */
    private int maxRiderHeight;

    /** Tải trọng tối đa (kg) */
    private double maxWeightCapacityKg;

    /** Trọng lượng xe (kg) */
    private double weightKg;

    /** Màu sắc */
    private String color;
}
