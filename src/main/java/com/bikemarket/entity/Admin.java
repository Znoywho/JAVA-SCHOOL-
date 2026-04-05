package com.bikemarket.entity;

import com.bikemarket.enums.Role;


// NOTE: Buyer inherits from User by joining the `TABLE`
public class Admin extends User {

  public Admin(String name, String email, String phone, String password) {
    super(name, email, phone, password, Role.ADMIN);
  }

}
