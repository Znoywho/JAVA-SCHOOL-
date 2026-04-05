package com.bikemarket.entity;

import com.bikemarket.enums.Role;

// NOTE: Buyer is a helper object, not a JPA entity
public class Buyer extends User {

  public Buyer() {
    super();
  }

  public Buyer(String name, String email, String phone, String password) {
    super(name, email, phone, password, Role.BUYER);
  }

}
