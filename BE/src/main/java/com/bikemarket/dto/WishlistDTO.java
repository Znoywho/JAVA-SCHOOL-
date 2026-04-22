package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class WishlistDTO {
    private long id;
    private long buyerId;
    private String buyerName;
    private long productId;
    private String productTitle;
    private double productPrice;
    private LocalDateTime addedAt;
}
