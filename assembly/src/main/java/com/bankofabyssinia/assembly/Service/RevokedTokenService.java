package com.bankofabyssinia.assembly.Service;

import com.bankofabyssinia.assembly.model.RevokedToken;
import com.bankofabyssinia.assembly.repo.RevokedTokenRepository;
import com.bankofabyssinia.assembly.Util.JwtUtil;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RevokedTokenService {
    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public void revokeToken(String accessToken, String refreshToken) {

        String accessJti = jwtUtil.extractJti(accessToken);
        String refreshJti = jwtUtil.extractJti(refreshToken);

        // revoke both tokens
        RevokedToken revokedAccessToken = RevokedToken.builder()
        .jti(accessJti)
        .revokedAt(Instant.now())
        .build();
        RevokedToken revokedRefreshToken = RevokedToken.builder()
        .jti(refreshJti)
        .revokedAt(Instant.now())
        .build();
        revokedTokenRepository.save(revokedAccessToken);
        revokedTokenRepository.save(revokedRefreshToken);
    }

    public boolean isTokenRevoked(String jti) {
        return revokedTokenRepository.existsByJti(jti);
    }
}