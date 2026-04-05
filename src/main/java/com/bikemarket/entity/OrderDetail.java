package com.bikemarket.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "OrderDetail")
public class OrderDetail {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "OrderId", nullable = false, foreignKey = @ForeignKey(name = "OrderId"))
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ProductId", nullable = false, foreignKey = @ForeignKey(name = "ProductId"))
  private Product product;

  @Column(name = "quantity", nullable = false)
  private int quantity;

  @Column(name = "price", nullable = false)
  private double price;

  public OrderDetail() {
  }

  OrderDetail(Order order, Product product, int quantity, double price) {
    this.order = order;
    this.product = product;
    this.quantity = quantity;
    this.price = price;
  }

  public long getId() {
    return Id;
  }

  public Order getOrder() {
    return order;
  }

  public Product getProduct() {
    return product;
  }

  public int getQuantity() {
    return quantity;
  }

  public double getPrice() {
    return price;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setPrice(double price) {
    this.price = price;
  }
}
