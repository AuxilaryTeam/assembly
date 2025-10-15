package com.bankofabyssinia.assembly.config;

import com.bankofabyssinia.assembly.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        System.out.println("🤝 WebSocket handshake attempt from: " + request.getRemoteAddress());
        System.out.println("🌐 Handshake URI: " + request.getURI());
        System.out.println("📋 Handshake Headers: " + request.getHeaders());

        // Check for Authorization header in handshake
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("🔐 JWT token found in handshake, length: " + token.length());

            try {
                // Validate token during handshake (optional)
                boolean isValid = jwtUtil.validateToken(token);
                if (isValid) {
                    String roleName = jwtUtil.extractClaim(token, claims -> claims.get("roleName", String.class));
                    System.out.println("✅ Handshake - Valid token for role: " + roleName);
                    attributes.put("userRole", roleName);
                    attributes.put("authenticated", true);
                } else {
                    System.out.println("❌ Handshake - Invalid token");
                    attributes.put("authenticated", false);
                }
            } catch (Exception e) {
                System.err.println("❌ Handshake - Token validation error: " + e.getMessage());
                attributes.put("authenticated", false);
            }
        } else {
            System.out.println("⚠️ Handshake - No Authorization header found");
            attributes.put("authenticated", false);
        }

        // Always allow handshake to proceed - we'll authenticate via messages later
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        if (exception == null) {
            System.out.println("✅ WebSocket handshake completed successfully");
        } else {
            System.err.println("❌ WebSocket handshake failed: " + exception.getMessage());
        }
    }
}