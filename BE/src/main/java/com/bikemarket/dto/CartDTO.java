package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    private long cartId;
    private long buyerId;
    private List<CartItemDTO> items;
    private int totalQuantity;
    private double totalPrice;
}
