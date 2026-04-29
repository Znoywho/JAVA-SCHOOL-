package com.bikemarket.entity;

import com.bikemarket.enums.*;



import com.bikemarket.enums.BillStatus;
import com.bikemarket.enums.OrderStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@Entity
@Table(name = "Orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "BuyerId", nullable = false, foreignKey = @ForeignKey(name = "BuyerId"))
  private User buyer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "SellerId", nullable = false, foreignKey = @ForeignKey(name = "SellerId"))
  private User seller;

  @Column(name = "total_price", nullable = false)
  private double totalPrice;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime created_at;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updated_at;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private OrderStatus status;

  @Enumerated(EnumType.STRING)
  @Column(name = "bill_status", nullable = false)
  private BillStatus billStatus;

  @Column(name = "payment_method")
  private String paymentMethod;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderDetail> orderDetails = new ArrayList<>();

  public Order() {
  }

  public Order(User buyer, User seller, double totalPrice, String paymentMethod) {
    this.buyer = buyer;
    this.seller = seller;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.status = OrderStatus.PENDING;
    this.billStatus = BillStatus.PENDING;
  }

  public long getId() {
    return this.Id;
  }

  public User getBuyer() {
    return this.buyer;
  }

  public User getSeller() {
    return this.seller;
  }

  public double getTotalPrice() {
    return this.totalPrice;
  }

  public LocalDateTime getCreated_at() {
    return this.created_at;
  }

  public OrderStatus getOrderStatus() {
    return this.status;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public List<OrderDetail> getOrderDetails() {
    return orderDetails;
  }

  public BillStatus getBillStatus() {
    return this.billStatus;
  }


  public void setBuyer(User buyer) {
    this.buyer = buyer;
  }

  public void setSeller(User seller) {
    this.seller = seller;
  }

  public void setTotalPrice(double totalPrice) {
    this.totalPrice = totalPrice;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public void addOrderDetail(OrderDetail orderDetail) {
    orderDetails.add(orderDetail);
    orderDetail.setOrder(this);
  }

  public void removeOrderDetail(OrderDetail orderDetail) {
    orderDetails.remove(orderDetail);
    orderDetail.setOrder(null);
  }

  public void setBillStatus(BillStatus billStatus) {
    this.billStatus = billStatus;
  }
}

