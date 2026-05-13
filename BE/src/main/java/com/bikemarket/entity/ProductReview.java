package com.bikemarket.entity;

import com.bikemarket.enums.ReviewRating;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(
        name = "product_reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_product_review_buyer_product",
                        columnNames = {"buyer_id", "product_id"}
                )
        }
)
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_product_review_buyer"))
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "fk_product_review_product"))
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", foreignKey = @ForeignKey(name = "fk_product_review_order"))
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "rating", nullable = false, length = 20)
    private ReviewRating rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ProductReview() {
    }

    public ProductReview(User buyer, Product product, Order order, ReviewRating rating, String comment) {
        this.buyer = buyer;
        this.product = product;
        this.order = order;
        this.rating = rating;
        this.comment = comment;
    }
}
