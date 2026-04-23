package com.bikemarket.service;

import com.bikemarket.entity.Order;
import com.bikemarket.entity.SellerReview;
import com.bikemarket.entity.User;
import com.bikemarket.enums.ReviewRating;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.ISellerReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SellerReviewService implements ISellerReviewService {

    @Autowired
    private ISellerReviewRepository reviewRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Override
    public SellerReview createReview(long buyerId, long sellerId, long orderId, ReviewRating rating, String comment) {
        User buyer = userService.findUserById(buyerId);
        if (buyer == null) {
            throw new ResourceNotFoundException("Buyer not found with id: " + buyerId);
        }

        User seller = userService.findUserById(sellerId);
        if (seller == null) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }

        Order order = orderService.findOrderById(orderId);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

        SellerReview review = new SellerReview(buyer, seller, order, rating, comment);
        return reviewRepository.save(review);
    }

    @Override
    public Optional<SellerReview> getReviewById(long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    @Override
    public List<SellerReview> getReviewsBysellerId(long sellerId) {
        User seller = userService.findUserById(sellerId);
        if (seller == null) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }
        return reviewRepository.findBysellerId(sellerId);
    }

    @Override
    public List<SellerReview> getReviewsByBuyerId(long buyerId) {
        User buyer = userService.findUserById(buyerId);
        if (buyer == null) {
            throw new ResourceNotFoundException("Buyer not found with id: " + buyerId);
        }
        return reviewRepository.findByBuyerId(buyerId);
    }

    @Override
    public Optional<SellerReview> getReviewByOrderId(long orderId) {
        return reviewRepository.findByOrderId(orderId);
    }

    @Override
    public SellerReview updateReview(long reviewId, ReviewRating rating, String comment) {
        SellerReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        review.setRating(rating);
        review.setComment(comment);
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(long reviewId) {
        SellerReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        reviewRepository.delete(review);
    }

    @Override
    public Double getAverageRatingBySellerId(long sellerId) {
        User seller = userService.findUserById(sellerId);
        if (seller == null) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }
        Double average = reviewRepository.getAverageRatingBySellerId(sellerId);
        return average != null ? average : 0.0;
    }

    @Override
    public long getReviewCountBySellerId(long sellerId) {
        User seller = userService.findUserById(sellerId);
        if (seller == null) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }
        return reviewRepository.countReviewsBySellerId(sellerId);
    }

    @Override
    public List<SellerReview> getRecentReviewsBySellerIdOrderByDate(long sellerId) {
        User seller = userService.findUserById(sellerId);
        if (seller == null) {
            throw new ResourceNotFoundException("Seller not found with id: " + sellerId);
        }
        return reviewRepository.findRecentReviewsBySellerIdOrderByDate(sellerId);
    }
}

