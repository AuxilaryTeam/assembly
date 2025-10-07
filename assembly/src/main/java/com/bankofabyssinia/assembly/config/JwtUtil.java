package com.bankofabyssinia.assembly.config;

import com.bankofabyssinia.assembly.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "pqsO7v2lfk+2g7HGj47zShhYxMCf2iCwYo0FCKXs5Pq4LIn2V6YrNo23sEtY+jERJ7dLgIShEnILH5Q45JmdGw==";
    // Replace with a strong secret key in production
    private final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("roleId", user.getRole().getId())
                .claim("roleName", user.getRole().getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        try{
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }


    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    public Long extractRoleId(String token) {
        return extractAllClaims(token).get("roleId", Long.class);
    }

    public String extractRoleName(String token) {
        return extractAllClaims(token).get("roleName", String.class);
    }


}
