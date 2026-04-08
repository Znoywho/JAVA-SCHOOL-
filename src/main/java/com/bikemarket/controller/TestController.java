package com.bikemarket.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Rebike application is running with Java 21 and Spring Boot 3.4.0!";
    }
}