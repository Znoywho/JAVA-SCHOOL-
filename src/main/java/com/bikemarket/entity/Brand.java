package com.bikemarket.entity;

import java.util.List;

import jakarta.persistence.GenerationType;

import jakarta.persistence.*;

@Entity
@Table(name = "Brand")
public class Brand {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "name")
  private String name;

  @OneToMany(mappedBy = "brand")
  private List<Product> products;


  public Brand(String name) {
    this.name = name;
    this.products = null;
  }
}
