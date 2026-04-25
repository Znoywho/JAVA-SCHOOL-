package com.bikemarket.service;

import com.bikemarket.entity.Brand;
import com.bikemarket.repository.IBrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Lớp thực thi các nghiệp vụ liên quan đến Hãng xe.
 * Triển khai từ IBrandService để cung cấp dữ liệu cho tầng Controller.
 */
@Service
public class BrandServiceImpl implements IBrandService {

    @Autowired
    private IBrandRepository brandRepository;

    /**
     * Truy xuất toàn bộ danh sách hãng xe từ cơ sở dữ liệu.
     * @return Danh sách đối tượng Brand.
     */
    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
}