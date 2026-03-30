package com.bikemarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.bikemarket.entity.User;
import com.bikemarket.enums.Role;
import com.bikemarket.service.UserService;
import jakarta.persistence.EntityManager;

@SpringBootApplication
public class RebikeApplication {

  public static void main(String[] args) {
    ApplicationContext context = SpringApplication.run(RebikeApplication.class, args);

    EntityManager entityManager = context.getBean(EntityManager.class);

    UserService userService = new UserService(entityManager);

    User savedUser = userService.findUserById(1L);
    if (savedUser != null) {
      System.out.println("✓ User found in database!");
      System.out.println("  Name: " + savedUser.getName());
      System.out.println("  Email: " + savedUser.getEmail());
      System.out.println("  Role: " + savedUser.getRole());
    } else {
      System.out.println("✗ User NOT found in database!");
    }
  }

}
