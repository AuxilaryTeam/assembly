package com.bankofabyssinia.assembly.Util;

import com.bankofabyssinia.assembly.model.RevokedToken;
import com.bankofabyssinia.assembly.model.User;
import com.bankofabyssinia.assembly.repo.RevokedTokenRepository;
import com.bankofabyssinia.assembly.repo.UserRepository;
// import com.bankofabyssinia.assembly.Service.RevokedTokenService;

import org.slf4j.Logger;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private static final String SECRET_KEY = "pqsO7v2lfk+2g7HGj47zShhYxMCf2iCwYo0FCKXs5Pq4LIn2V6YrNo23sEtY+jERJ7dLgIShEnILH5Q45JmdGw==";
    // Replace with a strong secret key in production
    private final long EXPIRATION_TIME = 900000;
    private final long REFRESH_EXPIRATION_TIME = 10800000;

    public String generateToken(User user, HttpServletRequest request) {

        String jti;

        // Check the jti is not in existing revoked token
        do {
            jti = UUID.randomUUID().toString(); // Generate a unique identifier for the token
        } while (revokedTokenRepository.existsByJti(jti)); // Replace false with actual check to see if jti is revoked

        AssemblyUserDetails userDetails = AssemblyUserDetails.buildUserDetails(user);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toList();

        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String fingerPrint = FingerprintUtil.generateFingerprint(ip, userAgent);

        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        var signingKey = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
                .setId(jti) // Set the unique identifier
                .setSubject(user.getEmail())
                .claim("roleName", user.getRole().getName())
                .claim("roleId", user.getRole().getId())
                .claim("userId", user.getId())
                .claim("roleId", user.getRole().getId())
                .claim("roleName", user.getRole().getName())
                .claim("fingerPrint", fingerPrint)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // Generate a refresh token with longer expiration
    public String generateRefreshToken(User user, HttpServletRequest request) {

        String jti; // Generate a unique identifier for the token

        // Check the jti is not in existing revoked token
        do {
            jti = UUID.randomUUID().toString(); // Generate a unique identifier for the token
        } while (revokedTokenRepository.existsByJti(jti)); // Replace false with actual check to see if jti is revoked

        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String fingerPrint = FingerprintUtil.generateFingerprint(ip, userAgent);

        byte[] rkeyBytes = Decoders.BASE64.decode(SECRET_KEY);
        var rSigningKey = Keys.hmacShaKeyFor(rkeyBytes);

        return Jwts.builder()
                .setId(jti) // Set the unique identifier on the refresh token
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("fingerPrint", fingerPrint)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
                .signWith(rSigningKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // Validate the token is not revoked and not expired
    public boolean validateToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String jti = claims.getId();

            // Check if the token is revoked
            if (revokedTokenRepository.existsByJti(jti)) {
                logger.warn("Token with JTI {} is revoked", jti);
                return false; // Token is revoked
            }

            logger.info("Token JTI: " + jti);

            // Check if the token is expired
            return !isTokenExpired(token);
        } catch (Exception e) {
            logger.error("Token validation error: {}", e.getMessage());
            return false; // If there's an error, consider the token as invalid
        }
    }

    // Validate refresh token and generate new access token
    public Map<String, String> refreshAccessToken(String refreshToken, HttpServletRequest request) {
        try {
            Claims claims = extractAllClaims(refreshToken);

            // Check jti
            String jti = claims.getId();
            if (jti == null || jti.isEmpty()) {
                throw new RuntimeException("Refresh token missing identifier");
            }
            if (revokedTokenRepository.existsByJti(jti)) {
                throw new RuntimeException("Refresh token revoked");
            }

            // Check expiration
            if (isTokenExpired(refreshToken)) {
                throw new RuntimeException("Refresh token expired");
            }

            // Fingerprint validation
            String tokenFinger = claims.get("fingerPrint", String.class);
            String ip = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            String currentFinger = FingerprintUtil.generateFingerprint(ip, userAgent);
            if (tokenFinger != null && !tokenFinger.equals(currentFinger)) {
                throw new RuntimeException("Refresh token fingerprint mismatch");
            }

            // Extract user id robustly
            Number userIdNumber = claims.get("userId", Number.class);
            if (userIdNumber == null) {
                throw new RuntimeException("Refresh token missing user id");
            }
            Long userId = userIdNumber.longValue();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // invalidate refresh token
            invalidateToken(refreshToken);

            Map<String, String> tokens = new java.util.HashMap<>();
            tokens.put("accessToken", generateToken(user, request));
            tokens.put("refreshToken", generateRefreshToken(user, request));
            return tokens;
        } catch (RuntimeException re) {
            throw re;
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token");
        }
    }

    public String extractJti(String token) {
        return extractAllClaims(token).getId();
    }

    public Claims extractAllClaims(String token) {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractFingerPrint(String token) {
        return extractAllClaims(token).get("fingerPrint", String.class);
    }

    public String extractRoleName(String token) {
        return extractAllClaims(token).get("roleName", String.class);
    }

    public Long extractRoleId(String token) {
        return extractAllClaims(token).get("roleId", Long.class);
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    public void invalidateToken(String token) {
        // make the token token invalid
        String jti = extractJti(token);
        RevokedToken revokedToken = RevokedToken.builder()
                .jti(jti)
                .revokedAt(Instant.now())
                .build();
        revokedTokenRepository.save(revokedToken);
    }

    // check if the token is expired
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true; // If there's an error, consider the token as expired/invalid
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

}
