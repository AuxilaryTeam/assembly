package com.bankofabyssinia.assembly.controller;

import com.bankofabyssinia.assembly.DTO.LoginRequest;
import com.bankofabyssinia.assembly.DTO.LoginResponse;
import com.bankofabyssinia.assembly.DTO.UserDTO;
import com.bankofabyssinia.assembly.model.User;

import jakarta.servlet.http.HttpServletRequest;

import com.bankofabyssinia.assembly.Service.AuthService;
import com.bankofabyssinia.assembly.Util.JwtUtil;

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

    @Autowired
    private JwtUtil jwtUtil;

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
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {

            LoginResponse response = authService.login( loginRequest, request);
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


    // logout and invalidate the token
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, @RequestBody Map<String, String> body) {
        try {
            String accessToken = body.get("accessToken");
            String refreshToken = body.get("refreshToken");

            if (accessToken == null || accessToken.isEmpty() || refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.status(400).body(
                        Map.of(
                                "error", "Bad Request",
                                "message", "Access token and refresh token are required. Please provide both tokens and try again."
                        )
                );
            } else {
                
                authService.logout(accessToken, refreshToken);
                return ResponseEntity.ok(
                        Map.of(
                                "message", "Logged out successfully"
                        )
                );      
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Logout failed",
                            "message", "There was an issue while logging out. Please try again later."
                    )
            );
        }
    }

     @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request, HttpServletRequest httpServletRequest) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.status(400).body(
                        Map.of(
                                "error", "Bad Request",
                                "message", "No refresh token provided. Please include a refresh token and try again."
                        )
                );
            }
            Map<String, String> tokens = jwtUtil.refreshAccessToken(refreshToken, httpServletRequest);
            return ResponseEntity.ok(
                        tokens
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Token refresh failed",
                            "message", "There was an issue while refreshing the token. Please try again later."
                    )
            );
        }
    }
}
