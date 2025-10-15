package com.bankofabyssinia.assembly.controller;

import com.bankofabyssinia.assembly.Util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class AttendanceWebSocketHandler extends TextWebSocketHandler {

    private final AtomicBoolean attendanceEnabled = new AtomicBoolean(true);
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        System.out.println("WebSocket connected: " + session.getId());

        // Send current status to new client
        sendToSession(session, createStatusMessage("STATUS", attendanceEnabled.get(), "Connected"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        if (payload == null || payload.trim().isEmpty()) {
            // ignore empty payloads (common during connect)
            return;
        }

        try {
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);
            String type = (String) data.get("type");

            if (type == null) {
                sendToSession(session, createErrorMessage("Missing message type"));
                return;
            }

            switch (type) {
                case "AUTHENTICATE" -> handleAuthentication(session, data);
                case "GET_STATUS" -> handleGetStatus(session);
                case "TOGGLE_ATTENDANCE" -> handleToggleAttendance(session, data);
                case "PING" -> sendToSession(session, createStatusMessage("PONG", null, "pong"));
                default -> sendToSession(session, createErrorMessage("Unknown message type"));
            }

        } catch (Exception e) {
            // Log invalid message but don’t spam the frontend
            System.out.println("⚠️ Ignored invalid message from client: " + payload);
        }
    }

    private void handleGetStatus(WebSocketSession session) throws IOException {
        sendToSession(session, createStatusMessage("STATUS", attendanceEnabled.get(), "Current status"));
    }

    private void handleToggleAttendance(WebSocketSession session, Map<String, Object> data) throws IOException {
        try {
            String token = (String) data.get("token");

            if (!isAdmin(token)) {
                sendToSession(session, createErrorMessage("Admin access required"));
                return;
            }

            boolean newState = !attendanceEnabled.get();
            attendanceEnabled.set(newState);

            String messageText = "Attendance " + (newState ? "enabled" : "disabled");
            broadcastToAll(createStatusMessage("TOGGLE", newState, messageText));

            System.out.println("Attendance toggled: " + messageText);

        } catch (Exception e) {
            sendToSession(session, createErrorMessage("Toggle failed"));
        }
    }

    private void handleAuthentication(WebSocketSession session, Map<String, Object> data) throws IOException {
        String token = (String) data.get("token");
        if (token != null) {
            try {
                boolean isAdmin = isAdmin(token);
                sendToSession(session, createStatusMessage("AUTH_RESULT", null,
                        "Authenticated as " + (isAdmin ? "ADMIN" : "USER")));
            } catch (Exception e) {
                sendToSession(session, createErrorMessage("Authentication failed"));
            }
        }
    }

    private boolean isAdmin(String token) {
        try {
            if (token == null)
                return false;

            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // First, check if token is expired
            if (jwtUtil.isTokenExpired(token)) {
                System.out.println("❌ Token is expired");
                return false;
            }

            // Try to extract role without full validation (skip fingerprint check for
            // WebSocket)
            String roleName = jwtUtil.extractClaim(token, claims -> claims.get("roleName", String.class));

            if (roleName == null) {
                System.out.println("❌ No role found in token");
                return false;
            }

            System.out.println("✅ Valid admin token for role: " + roleName);
            return "ADMIN".equals(roleName);

        } catch (Exception e) {
            System.out.println("❌ Token validation error: " + e.getMessage());
            return false;
        }
    }

    private Map<String, Object> createStatusMessage(String type, Boolean enabled, String message) {
        return Map.of(
                "type", type,
                "enabled", enabled,
                "message", message,
                "timestamp", System.currentTimeMillis());
    }

    private Map<String, Object> createErrorMessage(String message) {
        return Map.of(
                "type", "ERROR",
                "message", message,
                "timestamp", System.currentTimeMillis());
    }

    private void sendToSession(WebSocketSession session, Map<String, Object> message) {
        try {
            if (session.isOpen()) {
                String json = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(json));
            } else {
                sessions.remove(session.getId());
            }
        } catch (Exception e) {
            sessions.remove(session.getId());
        }
    }

    private void broadcastToAll(Map<String, Object> message) {
        if (sessions.isEmpty())
            return;

        try {
            String json = objectMapper.writeValueAsString(message);
            TextMessage textMessage = new TextMessage(json);

            sessions.values().removeIf(session -> !session.isOpen());

            sessions.values().forEach(session -> {
                try {
                    session.sendMessage(textMessage);
                } catch (IOException e) {
                    // Session will be removed in next cleanup
                }
            });
        } catch (Exception e) {
            // Log error silently
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        sessions.remove(session.getId());
    }

    @Override
    public void handleTransportError(@NonNull WebSocketSession session, @NonNull Throwable exception) throws Exception {
        sessions.remove(session.getId());
    }

    public int getActiveSessionsCount() {
        return sessions.size();
    }

    public boolean isAttendanceEnabled() {
        return attendanceEnabled.get();
    }

    public void setAttendanceEnabled(boolean enabled) {
        attendanceEnabled.set(enabled);
        broadcastToAll(createStatusMessage("TOGGLE", enabled,
                "Attendance " + (enabled ? "enabled" : "disabled") + " via API"));
    }
}