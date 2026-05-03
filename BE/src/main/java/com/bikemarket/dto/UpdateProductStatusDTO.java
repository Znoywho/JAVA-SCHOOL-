package com.bikemarket.dto;

import com.bikemarket.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dùng để thay đổi trạng thái tin đăng (SCRUM-5)
 * Seller có thể chuyển tin đăng qua lại giữa DRAFT, PUBLISHED, HIDDEN
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductStatusDTO {
    private ProductStatus status;
}
