package com.bikemarket.entity;

import com.bikemarket.enums.Role;


// NOTE: Seller is a helper object, not a JPA entity
public class Seller extends User {

  public Seller() {
    super();
  }

  public Seller(String name, String email, String phone, String password) {
    super(name, email, phone, password, Role.SELLER);
  }

}
