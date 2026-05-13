package com.bikemarket.service;

import com.bikemarket.dto.ProductRatingStatsDTO;
import com.bikemarket.entity.Order;
import com.bikemarket.entity.OrderDetail;
import com.bikemarket.entity.Product;
import com.bikemarket.entity.ProductReview;
import com.bikemarket.entity.User;
import com.bikemarket.enums.OrderStatus;
import com.bikemarket.enums.ReviewRating;
import com.bikemarket.enums.Role;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.IProductReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductReviewService implements IProductReviewService {

    @Autowired
    private IProductReviewRepository reviewRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Override
    public ProductReview createReview(long buyerId, long productId, Long orderId, ReviewRating rating, String comment) {
        User buyer = findBuyer(buyerId);
        Product product = productService.findProductById(productId);
        Order order = resolveOrder(orderId, buyerId, productId);
        validateRating(rating);

        if (reviewRepository.countByProductIdAndBuyerId(productId, buyerId) > 0) {
            throw new IllegalArgumentException("Buyer đã đánh giá sản phẩm này rồi");
        }

        ProductReview review = new ProductReview(buyer, product, order, rating, normalizeComment(comment));
        return reviewRepository.save(review);
    }

    @Override
    public Optional<ProductReview> getReviewById(long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    @Override
    public List<ProductReview> getReviewsByProductId(long productId) {
        productService.findProductById(productId);
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @Override
    public List<ProductReview> getReviewsByBuyerId(long buyerId) {
        findBuyer(buyerId);
        return reviewRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId);
    }

    @Override
    public Optional<ProductReview> getReviewByProductAndBuyer(long productId, long buyerId) {
        productService.findProductById(productId);
        findBuyer(buyerId);
        return reviewRepository.findByProductIdAndBuyerId(productId, buyerId);
    }

    @Override
    public ProductReview updateReview(long reviewId, ReviewRating rating, String comment) {
        validateRating(rating);
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Product review not found with id: " + reviewId));

        review.setRating(rating);
        review.setComment(normalizeComment(comment));
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Product review not found with id: " + reviewId));
        reviewRepository.delete(review);
    }

    @Override
    public ProductRatingStatsDTO getRatingStatsByProductId(long productId) {
        Product product = productService.findProductById(productId);
        Double average = reviewRepository.getAverageRatingByProductId(productId);

        return ProductRatingStatsDTO.builder()
                .productId(productId)
                .productTitle(product.getTitle())
                .averageRating(average != null ? average : 0.0)
                .totalReviews(reviewRepository.countReviewsByProductId(productId))
                .fiveStarCount(reviewRepository.countByProductIdAndRating(productId, ReviewRating.FIVE_STAR))
                .fourStarCount(reviewRepository.countByProductIdAndRating(productId, ReviewRating.FOUR_STAR))
                .threeStarCount(reviewRepository.countByProductIdAndRating(productId, ReviewRating.THREE_STAR))
                .twoStarCount(reviewRepository.countByProductIdAndRating(productId, ReviewRating.TWO_STAR))
                .oneStarCount(reviewRepository.countByProductIdAndRating(productId, ReviewRating.ONE_STAR))
                .build();
    }

    private User findBuyer(long buyerId) {
        User buyer = userService.findUserById(buyerId);
        if (buyer == null) {
            throw new ResourceNotFoundException("Buyer not found with id: " + buyerId);
        }
        if (buyer.getRole() != Role.BUYER) {
            throw new IllegalArgumentException("Chỉ tài khoản buyer mới được đánh giá sản phẩm");
        }
        return buyer;
    }

    private void validateRating(ReviewRating rating) {
        if (rating == null) {
            throw new IllegalArgumentException("Rating không được để trống");
        }
    }

    private Order resolveOrder(Long orderId, long buyerId, long productId) {
        if (orderId == null || orderId <= 0) {
            return null;
        }

        Order order;
        try {
            order = orderService.findOrderById(orderId);
        } catch (RuntimeException e) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }
        if (order.getBuyer() == null || order.getBuyer().getId() != buyerId) {
            throw new IllegalArgumentException("Đơn hàng không thuộc buyer này");
        }

        boolean containsProduct = order.getOrderDetails().stream()
                .map(OrderDetail::getProduct)
                .anyMatch(product -> product != null && product.getId() == productId);
        if (!containsProduct) {
            throw new IllegalArgumentException("Sản phẩm không nằm trong đơn hàng này");
        }

        if (order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Chỉ đánh giá được sản phẩm trong đơn đã giao");
        }

        return order;
    }

    private String normalizeComment(String comment) {
        if (comment == null || comment.isBlank()) {
            return null;
        }
        return comment.trim();
    }
}
