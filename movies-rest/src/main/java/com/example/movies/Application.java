package com.example.movies;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(
        title = "Movies API",
        version = "1.0.0",
        description = "CRUD REST service for movies, backed by SAP BTP Object Store"))
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}