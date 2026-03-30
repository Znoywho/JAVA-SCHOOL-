package com.bikemarket.service;

import com.bikemarket.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

public class UserService {
  private EntityManager entityManager;

  public UserService(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Transactional
  public void saveUser(User user) {
    entityManager.persist(user);
  }

  @Transactional
  public User findUserById(Long id) {
    return entityManager.find(User.class, id);
  }
}
