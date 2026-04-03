package com.bikemarket.service;

import com.bikemarket.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

  @PersistenceContext
  private EntityManager entityManager;

  public void saveUser(User user) {
    entityManager.persist(user);
  }

  public User findUserById(Long id) {
    return entityManager.find(User.class, id);
  }

  public User findUserByEmail(String email) {
    List<User> list = entityManager.createQuery("FROM User u WHERE u.email = :email", User.class)
            .setParameter("email", email)
            .getResultList();
    return list.isEmpty() ? null : list.get(0);
  }
}
