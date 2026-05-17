package com.bikemarket.controller;

import com.bikemarket.dto.AdminUserRequest;
import com.bikemarket.dto.ApiResponse;
import com.bikemarket.dto.UserDTO;
import com.bikemarket.enums.Role;
import com.bikemarket.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> listUsers(@RequestParam(required = false) Role role) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.getAdminUsers(role),
                "Admin users retrieved successfully"
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@RequestBody AdminUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(
                userService.createAdminUser(request),
                "User created successfully"
        ));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long userId,
            @RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.updateAdminUser(userId, request),
                "User updated successfully"
        ));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "User deleted successfully"));
    }
}
