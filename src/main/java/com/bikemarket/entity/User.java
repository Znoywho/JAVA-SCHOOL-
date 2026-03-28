package com.bikemarket.entity;

import com.bikemarket.enums.Role;

import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "Id")
  private long Id;

  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

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
  private LocalDateTime createdAt;

}
