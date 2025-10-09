package com.bankofabyssinia.assembly.Util;

import java.util.List;
import java.util.Arrays;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;





import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthTokenFilter extends OncePerRequestFilter{
    // List of public endpoints (Ant-style patterns)
   private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
    "/assembly/swagger-ui/**",
    "/assembly/v3/api-docs/**",
    "/assembly/swagger-ui.html",
    "/assembly/webjars/**",
    "/assembly/swagger-resources/**",
    "/assembly/api/auth/login",
    "/assembly/api/auth/logout",
    "/assembly/api/auth/register",
    "/assembly/api/auth/refresh-token",
    "/assembly/api/auth/change-password",
    "/assembly/api/role/create",
    "/assembly/api/role/all",
    "/assembly/actuator/**"
);

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    
    @Autowired
    private JwtUtil jwtUtil;


    @Autowired
    private AssemblyUserDetailService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        // Skip JWT validation for public endpoints using AntPathMatcher
        boolean isPublic = PUBLIC_ENDPOINTS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }
        try{
            String jwt = parseJwt(request);
            if(jwt != null && jwtUtil.validateToken(jwt)){
                String email = jwtUtil.extractEmail(jwt);

                String tokenFingerprint = jwtUtil.extractFingerPrint(jwt);

                String requestFingerPrint = FingerprintUtil.generateFingerprint(
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
                );

                if (!requestFingerPrint.equals(tokenFingerprint)) {
                // logger.warn("Fingerprint mismatch for user: {}", email);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Unauthorized: Invalid or missing JWT token\"}");
                return;
            }


                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
            } else {
                // logger.warn("Invalid or missing JWT token");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Unauthorized: Invalid or missing JWT token\"}");
                return;
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Unauthorized: " +  "\"}");
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if(headerAuth != null && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7);
        }

        return null;
        
    }

    


}
