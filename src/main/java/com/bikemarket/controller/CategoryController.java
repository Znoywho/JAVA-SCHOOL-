package com.bikemarket.controller;

import com.bikemarket.entity.Category;
import com.bikemarket.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ICategoryService categoryService;

    /**
     * Lay danh sach tat ca loai xe da duoc khoi tao tu Module 6
     * URL: http://localhost:8080/api/categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        
        // Neu danh sach trong thi tra ve status 204 (No Content)
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        // Neu co du lieu thi tra ve status 200 (OK) kem danh sach
        return ResponseEntity.ok(categories);
    }
}