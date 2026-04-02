package com.bikemarket.entity;

package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Bill")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "Id")
    private long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OrderId", nullable = false, foreignKey = @ForeignKey(name = "OrderId"))
    private Order order;    

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BuyerId", nullable = false, foreignKey = @ForeignKey(name = "BuyerId"))
    private Buyer buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SellerId", nullable = false, foreignKey = @ForeignKey(name = "SellerId"))
    private Seller seller; 

    @Column(name = "price", nullable = false)
    private double price;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime created_at;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BillStatus status;

    Bill(Order order, Buyer buyer, Seller seller, double price) {
        this.order = order;
        this.buyer = buyer;
        this.seller = seller;
        this.price = price;
        this.created_at = LocalDateTime.now();
        this.status = BillStatus.PENDING;
    }
}
