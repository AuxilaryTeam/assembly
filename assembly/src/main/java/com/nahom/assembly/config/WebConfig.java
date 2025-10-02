package com.nahom.assembly.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all endpoints
                .allowedOrigins("http://192.168.20.1:8085","localhost:5173") // Allow requests from the React app's origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow needed methods
                .allowedHeaders("Authorization", "Content-Type") // Allow specific headers like Authorization
                .allowCredentials(true); // Allow cookies and credentials if needed
    }
}
