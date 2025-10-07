package com.bankofabyssinia.assembly.controller;

import com.bankofabyssinia.assembly.DTO.LoginRequest;
import com.bankofabyssinia.assembly.DTO.LoginResponse;
import com.bankofabyssinia.assembly.DTO.UserDTO;
import com.bankofabyssinia.assembly.model.User;
import com.bankofabyssinia.assembly.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO user) {
        try {
            User registeredUser = authService.register(user);
            return ResponseEntity.ok(
                    Map.of(
                            "message", "User registered successfully",
                            "user", registeredUser
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Registration failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {

            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(
                  response
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    Map.of(
                            "error", "Login failed",
                            "message", e.getMessage()
                    )
            );
        }
    }
}
