package com.bikemarket.dto;

import com.bikemarket.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private Role role;
}
