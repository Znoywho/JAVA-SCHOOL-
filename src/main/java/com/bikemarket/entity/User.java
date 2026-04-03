package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(unique = true, nullable = false, length = 100)
  private String email;

  @Column(length = 15)
  private String phone;

  // NOTE: Should I hash password
  // @Column(name = "password_hash", nullable = false)
  // private String passwordHash;
  @Column(name = "password", nullable = false)
  private String password;

  // @Column(length = 255)
  // private String address;

  // @Column(name = "avatar_url")
  // private String avatarUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Role role;

  // @Column(name = "is_active", nullable = false)
  // private boolean isActive = true;
  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime created_at;

  public User() {
  }

  public User(String name, String email, String phone, String password, Role role) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.created_at = LocalDateTime.now();
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPhone() {
    return phone;
  }

  public String getPassword() {
    return password;
  }

  public Role getRole() {
    return role;
  }

  public LocalDateTime getCreated_at() {
    return created_at;
  }

  public long getId() {
    return Id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }


  public void setPassword(String password) {
    this.password = password;
  }

  public void setRole(Role role) {
    this.role = role;
  }

}
