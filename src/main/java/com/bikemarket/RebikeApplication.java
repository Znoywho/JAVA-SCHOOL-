package com.bikemarket;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.bikemarket.entity.User;
import com.bikemarket.enums.Role;
import com.bikemarket.service.UserService;

import java.util.List;

@SpringBootApplication
public class RebikeApplication {

  public static void main(String[] args) {
    SpringApplication.run(RebikeApplication.class, args);
  }

  @Bean
  public CommandLineRunner seedUsers(UserService userService) {
    return args -> {
      List<User> seedUsers = List.of(
              new User("Test Buyer", "testbuyer1@example.com", "0123456789", "password", Role.BUYER),
              new User("Test Seller", "testseller1@example.com", "0123456788", "password", Role.SELLER),
              new User("Test Inspector", "testinspector1@example.com", "0123456787", "password", Role.INSPECTOR),
              new User("Test Admin", "testadmin1@example.com", "0123456786", "password", Role.ADMIN)
      );

      for (User user : seedUsers) {
        if (userService.findUserByEmail(user.getEmail()) == null) {
          userService.saveUser(user);
          System.out.println("Seeded user role: " + user.getRole() + " (" + user.getEmail() + ")");
        } else {
          System.out.println("User already exists: " + user.getEmail());
        }
      }
    };
  }

}
