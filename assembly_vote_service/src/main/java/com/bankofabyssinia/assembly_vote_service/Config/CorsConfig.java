package com.bankofabyssinia.assembly_vote_service.Config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")   // Allow all origins
                        .allowedMethods("*")   // Allow all methods (GET, POST, etc.)
                        .allowedHeaders("*");  // Allow all headers
            }
        };
    }
}
