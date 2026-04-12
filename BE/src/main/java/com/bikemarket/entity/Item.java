package com.bikemarket.entity;


import jakarta.persistence.*;


/**
 * Item
 */
@Entity
@Table(name = "Item")
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "Cart", nullable = true, foreignKey = @ForeignKey(name = "Cart"))
  private Cart cart;

  // TODO: join column of order

  @Column(name = "Quantity")
  private int quantity;

  @Column(name = "Discount")
  private double discount;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ProductId", nullable = false, foreignKey = @ForeignKey(name = "ProductId"))
  private Product product;

  public Item() {
  }

  public Item(Cart cart, int quantity, double discount, Product product) {
    this.cart = cart;
    this.quantity = quantity;
    this.discount = discount;
    this.product = product;
  }

  public Long getId() {
    return Id;
  }

  public Cart getCart() {
    return cart;
  }

  public int getQuantity() {
    return quantity;
  }

  public double getDiscount() {
    return discount;
  }

  public void setCart(Cart cart) {
    this.cart = cart;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setDiscount(double discount) {
    this.discount = discount;
  }

  public Product getProduct() {
    return product;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public double getTotalPrice() {
    return (product.getPrice() * quantity)*discount;
  }
}