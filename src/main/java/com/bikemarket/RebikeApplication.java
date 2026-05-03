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
}
