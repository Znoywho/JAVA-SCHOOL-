package com.bikemarket.service;
import com.bikemarket.entity.Category;
import java.util.List;

public interface ICategoryService {
    List<Category> getAllCategories();
}