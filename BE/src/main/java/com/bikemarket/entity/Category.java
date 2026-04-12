package com.bikemarket.entity;

import java.util.List;
import jakarta.persistence.GenerationType;


import jakarta.persistence.*;

@Entity
@Table(name = "Category")
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "name")
  private String name;

  @OneToMany(mappedBy = "category")
  private List<Product> products;

  public Category(String name) {
    this.name = name;
    this.products = null;
  }

  public String getName() {
    return name;
  }

  public List<Product> getProducts() {
    return products;
  }

}
