package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private long itemId;
    private long productId;
    private String productTitle;
    private double productPrice;
    private int quantity;
    private double totalPrice;
}
