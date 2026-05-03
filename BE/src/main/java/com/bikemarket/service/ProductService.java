package com.bikemarket.service;

import com.bikemarket.dto.BikeRequestDTO;
import com.bikemarket.dto.ProductRequestDTO;
import com.bikemarket.entity.Bike;
import com.bikemarket.entity.Brand;
import com.bikemarket.entity.Category;
import com.bikemarket.entity.Product;
import com.bikemarket.entity.User;
import com.bikemarket.enums.ProductStatus;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.IBrandRepository;
import com.bikemarket.repository.ICategoryRepository;
import com.bikemarket.repository.IProductRepository;
import com.bikemarket.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

/**
 * Service xử lý nghiệp vụ Module Đăng tin & Quản lý xe - SCRUM-5
 */
@Service
@Transactional
public class ProductService implements IProductService {

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IBrandRepository brandRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    // =========================================================
    // Seller: Tạo tin đăng
    // =========================================================

    @Override
    public Product createProduct(ProductRequestDTO dto) {
        User seller = findSellerById(dto.getSellerId());
        Brand brand = findBrandById(dto.getBrandId());
        Category category = findCategoryById(dto.getCategoryId());

        Product product = new Product(
                dto.getTotal(),
                seller,
                dto.getTitle(),
                brand,
                category,
                dto.getConditionPercent(),
                dto.getPrice()
        );

        return productRepository.save(product);
    }

    @Override
    public Bike createBike(BikeRequestDTO dto) {
        User seller = findSellerById(dto.getSellerId());
        Brand brand = findBrandById(dto.getBrandId());
        Category category = findCategoryById(dto.getCategoryId());

        Bike bike = new Bike(
                dto.getTotal(),
                seller,
                dto.getTitle(),
                brand,
                category,
                dto.getConditionPercent(),
                dto.getPrice(),
                dto.getFrameSize(),
                dto.getWheelSize(),
                dto.isVerified(),
                dto.getMinRiderHeight(),
                dto.getMaxRiderHeight(),
                dto.getMaxWeightCapacityKg(),
                dto.getWeightKg(),
                dto.getColor()
        );

        return (Bike) productRepository.save(bike);
    }

    // =========================================================
    // Seller: Cập nhật tin đăng
    // =========================================================

    @Override
    public Product updateProduct(long productId, ProductRequestDTO dto) {
        Product product = findProductById(productId);

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            product.setTitle(dto.getTitle());
        }
        if (dto.getPrice() > 0) {
            product.setPrice(dto.getPrice());
        }
        if (dto.getTotal() >= 0) {
            product.setTotal(dto.getTotal());
        }
        if (dto.getConditionPercent() >= 0 && dto.getConditionPercent() <= 100) {
            product.setConditionPercent(dto.getConditionPercent());
        }
        if (dto.getBrandId() > 0) {
            product.setBrand(findBrandById(dto.getBrandId()));
        }
        if (dto.getCategoryId() > 0) {
            product.setCategory(findCategoryById(dto.getCategoryId()));
        }

        return productRepository.save(product);
    }

    @Override
    public Product updateProductStatus(long productId, ProductStatus status) {
        Product product = findProductById(productId);
        product.setStatus(status);
        return productRepository.save(product);
    }

    // =========================================================
    // Seller: Xóa tin đăng (soft delete)
    // =========================================================

    @Override
    public void deleteProduct(long productId) {
        Product product = findProductById(productId);
        product.setStatus(ProductStatus.DELETED);
        productRepository.save(product);
    }

    // =========================================================
    // Truy vấn (dùng bởi ProductViewController + các service khác)
    // =========================================================

    @Override
    public Product findProductById(long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    @Override
    public Page<Product> getSellerProducts(long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        return productRepository.findBySellerId_Id(sellerId, pageable);
    }

    @Override
    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        return productRepository.findByStatus(ProductStatus.PUBLISHED, pageable);
    }

    @Override
    public Page<Product> getProductsByCategory(long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        return productRepository.findByCategory_IdAndStatus(categoryId, ProductStatus.PUBLISHED, pageable);
    }

    @Override
    public Page<Product> getProductsByBrand(long brandId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        return productRepository.findByBrand_IdAndStatus(brandId, ProductStatus.PUBLISHED, pageable);
    }

    @Override
    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        return productRepository.searchByTitleAndStatus(keyword, ProductStatus.PUBLISHED, pageable);
    }

    @Override
    public Page<Product> getProductsByPriceRange(double minPrice, double maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("price").ascending());
        return productRepository.findByPriceBetweenAndStatus(minPrice, maxPrice, ProductStatus.PUBLISHED, pageable);
    }

    // =========================================================
    // Helper methods
    // =========================================================

    private User findSellerById(long sellerId) {
        return userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));
    }

    private Brand findBrandById(long brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));
    }

    private Category findCategoryById(long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }
}
