package com.bikemarket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyerRegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
}
