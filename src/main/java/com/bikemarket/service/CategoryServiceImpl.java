package com.bikemarket.service;

import com.bikemarket.entity.Category;
import com.bikemarket.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Lớp thực thi các nghiệp vụ liên quan đến Danh mục xe.
 * Triển khai từ ICategoryService để cung cấp dữ liệu cho tầng Controller.
 */
@Service
public class CategoryServiceImpl implements ICategoryService {

    @Autowired
    private ICategoryRepository categoryRepository;

    /**
     * Truy xuất toàn bộ danh sách danh mục xe từ cơ sở dữ liệu.
     * @return Danh sách đối tượng Category.
     */
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}