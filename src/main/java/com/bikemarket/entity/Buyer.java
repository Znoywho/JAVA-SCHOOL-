package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// NOTE: Buyer is a helper object, not a JPA entity
public class Buyer extends User {

  public Buyer() { super(); }

  public Buyer(String name, String email, String phone, String password) {
    super(name, email, phone, password, Role.BUYER);
  }

}
