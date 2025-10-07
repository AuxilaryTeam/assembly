package com.bankofabyssinia.assembly.Service;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.bankofabyssinia.assembly.repo.RoleRepository;
import com.bankofabyssinia.assembly.repo.UserRepository;
import com.bankofabyssinia.assembly.DTO.LoginRequest;
import com.bankofabyssinia.assembly.DTO.LoginResponse;
import com.bankofabyssinia.assembly.DTO.UserDTO;
import com.bankofabyssinia.assembly.config.JwtUtil;
import com.bankofabyssinia.assembly.model.Role;
import com.bankofabyssinia.assembly.model.User;

import java.net.http.HttpRequest;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RoleRepository roleRepo;

    public User register(UserDTO user) {
        user.setPassword(encoder.encode(user.getPassword()));

        User newUser = User.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getUsername())
                .password(user.getPassword())
                .role(roleRepo.findById(user.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Default role USER not found")))
                .build();

        return userRepo.save(newUser);
    }

    public LoginResponse login (LoginRequest loginRequest) {
        Optional<User> userOpt = userRepo.findByEmailIgnoreCase(loginRequest.getEmail());

        // login with username or email (added feature)
        if (userOpt.isEmpty()) {
            userOpt = userRepo.findByUsernameIgnoreCase(loginRequest.getUsername());
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user);

                return LoginResponse.builder()
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .token(token)
                        .build();
            } else {
                throw new RuntimeException("Incorrect password");
            }
        } else {
            throw new RuntimeException("User not found with email: " + loginRequest.getEmail());
        }
    }

    public String getToken(HttpServletRequest requestHeader) throws IllegalArgumentException {
        String authHeader = requestHeader.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return token;
        } else {
            throw new IllegalArgumentException("Authorization header is missing or invalid");
        }
    }


    public User getUserFromToken(String token) {
        String email = jwtUtil.extractEmail(token);
        return userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public Role getRoleFromToken(String token) {
        Long roleId = jwtUtil.extractRoleId(token);
        return roleRepo.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
    }
}
