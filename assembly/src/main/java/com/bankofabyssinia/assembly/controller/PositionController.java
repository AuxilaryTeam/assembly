package com.bankofabyssinia.assembly.controller;

import com.bankofabyssinia.assembly.DTO.PositionDTO;
import com.bankofabyssinia.assembly.model.Position;
import com.bankofabyssinia.assembly.model.Role;
import com.bankofabyssinia.assembly.model.User;
import com.bankofabyssinia.assembly.Service.AuthService;
import com.bankofabyssinia.assembly.Service.PositionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/positions")
public class PositionController {
    @Autowired
    private PositionService positionService;

    @Autowired
    private AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody PositionDTO positionDTO, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Position savedPosition = positionService.createPosition(positionDTO, user);
            return ResponseEntity.ok(savedPosition);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Position creation failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@RequestBody PositionDTO positionDTO, @PathParam("id") Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
       try {
           Position updatedPosition = positionService.updatePosition(positionDTO, id, user);
           return ResponseEntity.ok(updatedPosition);
       } catch (Exception e) {
           return ResponseEntity.status(500).body(
                //    "Error updating position: " + e.getMessage()
                     Map.of(
                            "error", "Could not update position",
                            "message", e.getMessage()
                     )
           );
       }
    }

    // activate a position
    @PutMapping("/activate/{id}")
    public ResponseEntity<?> activatePosition(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        Role userRole = authService.getRoleFromToken(token);
        if (!userRole.getName().equals("ADMIN")) {
            return ResponseEntity.status(403).body(
                    Map.of(
                            "error", "Forbidden",
                            "message", "You do not have permission to activate positions"
                    )
            );
        }
        try {
            Position activatedPosition = positionService.activatePosition(id, user);
            return ResponseEntity.ok(activatedPosition);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    // "Error activating position: " + e.getMessage()
                    Map.of(
                            "error", "Could not activate position",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // close position
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closePosition(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        Role userRole = authService.getRoleFromToken(token);
        if (!userRole.getName().equals("ADMIN")) {
            return ResponseEntity.status(403).body(
                    Map.of(
                            "error", "Forbidden",
                            "message", "You do not have permission to close positions"
                    )
            );
        }
        try {
            Position closedPosition = positionService.closePosition(id, user);
            return ResponseEntity.ok(closedPosition);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    // "Error closing position: " + e.getMessage()
                    Map.of(
                            "error", "Could not close position",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // List of active positions
    @GetMapping("/active")
    public ResponseEntity<?> listOfActivePositions(HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            return ResponseEntity.ok(positionService.getActivePositions(user));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve active positions",
                            "message", e.getMessage()
                    )
            );
        }
    }


}
