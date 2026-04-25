package com.bikemarket;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.bikemarket.entity.Category;
import com.bikemarket.entity.Brand;
import com.bikemarket.repository.ICategoryRepository;
import com.bikemarket.repository.IBrandRepository;

@SpringBootApplication
public class RebikeApplication {

    public static void main(String[] args) {
        SpringApplication.run(RebikeApplication.class, args);
    }

    @Bean
    public CommandLineRunner initMasterData(ICategoryRepository categoryRepo, IBrandRepository brandRepo) {
        return args -> {
            if (categoryRepo.count() == 0) {
                String[] categories = {"Xe đạp địa hình", "Xe đạp đua", "Xe đạp đường phố", "Xe đạp trẻ em"};
                for (String name : categories) {
                    Category cat = new Category();
                    cat.setName(name);
                    categoryRepo.save(cat);
                }
                System.out.println(">>> MODULE 6: DA KHOI TAO CATEGORY!");
            }

            if (brandRepo.count() == 0) {
                String[] brands = {"Giant", "Trek", "Asama", "Martin 107", "Thống Nhất"};
                for (String name : brands) {
                    Brand b = new Brand();
                    b.setName(name);
                    brandRepo.save(b);
                }
                System.out.println(">>> MODULE 6: DA KHOI TAO BRAND!");
            }
        };
    }
}