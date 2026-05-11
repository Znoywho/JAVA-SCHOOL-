package com.bikemarket.controller;

import com.bikemarket.dto.ApiResponse;
import com.bikemarket.entity.User;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ======= Login =======
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Bad Request", "Email và mật khẩu không được để trống"));
            }

            User user = userService.findUserByEmail(email);
            System.out.println(user);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Unauthorized", "Email không tồn tại"));
            }

            if (!user.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Unauthorized", "Mật khẩu không chính xác"));
            }

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("role", user.getRole().name());

            return ResponseEntity.ok(ApiResponse.ok(userData, "Đăng nhập thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal Server Error", e.getMessage()));
        }
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        return ResponseEntity.ok(user);
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.findUserByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        return ResponseEntity.ok(user);
    }

    // Create new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User existingUser = userService.findUserById(id);
        if (existingUser == null) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        user.setId(id);
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userService.deleteUser(user);
        return ResponseEntity.noContent().build();
    }
}