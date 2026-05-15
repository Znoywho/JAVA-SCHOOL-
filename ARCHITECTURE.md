# REBIKE Application Architecture Guide

## 📋 Mục lục
1. [Project Structure](#project-structure)
2. [Exception Handling Flow](#exception-handling-flow)
3. [Controller Flow](#controller-flow)
4. [Cách hoạt động từng bước](#cách-hoạt-động-từng-bước)
5. [Cách sử dụng API](#cách-sử-dụng-api)
6. [Cách tạo Controller mới](#cách-tạo-controller-mới)

---

## Project Structure

```
src/main/java/com/bikemarket/
├── controller/          # REST API endpoints
│   └── UserController.java
├── service/             # Business logic
│   ├── IUserService.java
│   └── UserService.java
├── repository/          # Database access
│   └── UserRepository.java
├── entity/              # JPA entities
│   └── User.java
├── exception/           # Exception handling
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java
├── dto/                 # Data Transfer Objects
│   └── ApiResponse.java
└── enums/              # Enumerations
    └── Role.java
```

---

## Exception Handling Flow

### Architecture
```
┌─────────────────────────────────────┐
│         UserController              │
│   (Xử lý HTTP requests)             │
└────────────────┬────────────────────┘
                 │
                 ├─ Throw exception nếu có lỗi
                 │
                 ▼
┌─────────────────────────────────────┐
│   GlobalExceptionHandler            │
│   (@RestControllerAdvice)           │
│                                     │
│ ✓ @ExceptionHandler methods        │
│   - Bắt ResourceNotFoundException    │
│   - Bắt validation errors          │
│   - Bắt generic exceptions         │
└────────────────┬────────────────────┘
                 │
                 ├─ Convert to JSON response
                 ├─ Set HTTP status code
                 │
                 ▼
┌─────────────────────────────────────┐
│         Client (Postman/Browser)    │
│   Nhận response với status code      │
└─────────────────────────────────────┘
```

### Exception Types

#### 1. ResourceNotFoundException
**Kinh Tế:** User không tìm thấy
```java
// File: src/main/java/com/bikemarket/exception/ResourceNotFoundException.java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

**Handled By:**
```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ApiResponse<?>> handleResourceNotFound(ResourceNotFoundException ex) {
    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)  // 404
            .body(ApiResponse.error("Not Found", ex.getMessage()));
}
```

**Response:**
```json
{
  "success": false,
  "message": "Not Found",
  "error": "User not found with ID: 999"
}
```

---

## Controller Flow

### UserController Request-Response Flow

```
1. CLIENT REQUEST
   └─ GET /api/users/1

2. CONTROLLER METHOD
   ├─ @GetMapping("/{id}")
   ├─ public ResponseEntity<User> getUserById(@PathVariable Long id)
   └─ Tìm user trong database

3. BUSINESS LOGIC (via Service)
   └─ userService.findUserById(id)

4a. HAPPY PATH (User tìm thấy)
   ├─ Trả về User object
   └─ return ResponseEntity.ok(user)  [200 OK]

4b. ERROR PATH (User không tìm thấy)
   ├─ if (user == null)
   ├─ throw new ResourceNotFoundException("...")
   └─ Exception Handler bắt
       ├─ Convert to JSON
       └─ return 404 NOT_FOUND

5. CLIENT RESPONSE
   └─ JSON body + HTTP status code
```

---

## Cách hoạt động từng bước

### Step 1: Controller nhận request
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        // Bước 2
        User user = userService.findUserById(id);
        
        // Bước 3
        if (user == null) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        
        // Bước 4 (happy path)
        return ResponseEntity.ok(user);
    }
}
```

### Step 2: Service tìm user
```java
@Service
public class UserService implements IUserService {
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserById(long id) {
        return userRepository.findById(id)
                .orElse(null);  // null nếu không tìm thấy
    }
}
```

### Step 3: Exception Handler tự động bắt
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(
            ResourceNotFoundException ex) {
        
        // 1. Log cảnh báo
        logger.warn("Resource not found: {}", ex.getMessage());
        
        // 2. Tạo error response
        ApiResponse<?> response = ApiResponse.error(
            "Not Found",           // message
            ex.getMessage()        // error detail
        );
        
        // 3. Trả về 404 status
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
}
```

### Step 4: Client nhận response
```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "success": false,
  "message": "Not Found",
  "error": "User not found with ID: 999"
}
```

---

## Cách sử dụng API

### 1. Get All Users
```bash
curl -X GET http://localhost:8080/api/users
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Test Buyer",
    "email": "testbuyer1@example.com",
    "phone": "0123456789",
    "password": "password",
    "role": "BUYER",
    "created_at": "2026-04-03T23:11:33"
  }
]
```

### 2. Get User by ID (Success)
```bash
curl -X GET http://localhost:8080/api/users/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Test Buyer",
  "email": "testbuyer1@example.com",
  ...
}
```

### 3. Get User by ID (Error)
```bash
curl -X GET http://localhost:8080/api/users/999
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Not Found",
  "error": "User not found with ID: 999"
}
```

### 4. Get User by Email
```bash
curl -X GET http://localhost:8080/api/users/email/testbuyer1@example.com
```

### 5. Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "phone": "0987654321",
    "password": "securepass",
    "role": "BUYER"
  }'
```

**Response (201 Created):**
```json
{
  "id": 5,
  "name": "New User",
  "email": "newuser@example.com",
  ...
}
```

### 6. Update User
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "newmail@example.com",
    "phone": "0111111111",
    "password": "newpass",
    "role": "SELLER"
  }'
```

### 7. Delete User
```bash
curl -X DELETE http://localhost:8080/api/users/1
```

**Response (204 No Content):**
```
(No body)
```

---

## Cách tạo Controller mới

### Ví dụ: ProductController

#### Step 1: Tạo file ProductController
```java
// src/main/java/com/bikemarket/controller/ProductController.java

package com.bikemarket.controller;

import com.bikemarket.entity.Product;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.findProductById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {
        Product existing = productService.findProductById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        product.setId(id);
        productService.updateProduct(product);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productService.findProductById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        productService.deleteProduct(product);
        return ResponseEntity.noContent().build();
    }
}
```

#### Step 2: Exception Handler sẽ tự động xử lý!
- Không cần thêm code gì
- Tất cả `ResourceNotFoundException` sẽ được `GlobalExceptionHandler` bắt
- Tự động trả về 404 + JSON response

#### Kết quả
```bash
curl -X GET http://localhost:8080/api/products/999
```

```json
{
  "success": false,
  "message": "Not Found",
  "error": "Product not found with ID: 999"
}
```

---

## HTTP Status Codes Được Sử Dụng

| Code | Meaning | Controller Action |
|------|---------|------------------|
| 200 | OK | GET, PUT (thành công) |
| 201 | Created | POST (tạo mới) |
| 204 | No Content | DELETE (xóa thành công) |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource không tồn tại |
| 500 | Internal Server Error | Lỗi server |

---

## ApiResponse Helper Class

```java
// src/main/java/com/bikemarket/dto/ApiResponse.java

@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String error;

    // Helper methods
    public static <T> ApiResponse<T> ok(T data, String message)
    public static <T> ApiResponse<T> ok(T data)
    public static <T> ApiResponse<T> error(String message)
    public static <T> ApiResponse<T> error(String message, String error)
}
```

**Sử dụng:**
```java
// Success
ApiResponse.ok(user, "User retrieved successfully")

// Error
ApiResponse.error("Not Found", "User not found with ID: 999")
```

---

## Logging

Exception Handler có logging built-in:

```java
logger.warn("Resource not found: {}", ex.getMessage());  // 404
logger.warn("Validation error: {}", errorMessage);       // 400
logger.error("Internal server error", ex);               // 500
```

Kiểm tra logs để debug:
```bash
grep "Resource not found" logs/app.log
```

---

## Tóm tắt Flow

```
Request → Controller → Service → Repository → Database
                ↓
        Check if exists?
                ↓
          ✓ YES → return data
                ↓
         throw exception
                ↓
     GlobalExceptionHandler
                ↓
      format response + status
                ↓
           Client (JSON)
```

---

## Key Points

✅ **GlobalExceptionHandler** = một nơi quản lý tất cả exceptions  
✅ **ResourceNotFoundException** = throw khi resource không tìm thấy  
✅ **Không cần if-else** trong controller, chỉ throw exception  
✅ **Tự động JSON response** = exception handler làm hết  
✅ **Dùng lại cho tất cả controller** = không copy-paste code

---

## Files to Read

1. **Exception Handling:**
   - `src/main/java/com/bikemarket/exception/GlobalExceptionHandler.java`
   - `src/main/java/com/bikemarket/exception/ResourceNotFoundException.java`

2. **Controller Example:**
   - `src/main/java/com/bikemarket/controller/UserController.java`

3. **Service Layer:**
   - `src/main/java/com/bikemarket/service/IUserService.java`
   - `src/main/java/com/bikemarket/service/UserService.java`

4. **Response Wrapper:**
   - `src/main/java/com/bikemarket/dto/ApiResponse.java`

---

## Tips

- Luôn throw exception thay vì return null
- Exception Handler sẽ bắt và format tự động
- Viết controller mới theo template UserController
- Mỗi exception type cần một @ExceptionHandler method
