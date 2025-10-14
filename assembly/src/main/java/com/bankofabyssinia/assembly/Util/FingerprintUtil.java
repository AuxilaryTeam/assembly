package com.bankofabyssinia.assembly.Util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class FingerprintUtil {
    // This is a placeholder for fingerprint generation logic
    public static String generateFingerprint(String ip, String userAgent) {
        try{
            String raw = ip + "|" + userAgent;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating fingerprint");
        }
    }

    
}