package com.bikemarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bikemarket.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}