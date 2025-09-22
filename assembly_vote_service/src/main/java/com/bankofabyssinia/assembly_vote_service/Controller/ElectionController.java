package com.bankofabyssinia.assembly_vote_service.Controller;


import com.bankofabyssinia.assembly_vote_service.Entity.Election;
import com.bankofabyssinia.assembly_vote_service.Entity.User;
import com.bankofabyssinia.assembly_vote_service.Service.AuthService;
import com.bankofabyssinia.assembly_vote_service.Service.ElectionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/elections")
public class ElectionController {
    @Autowired
    private ElectionService electionService;

    @Autowired
    private AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<?> creatElection(@RequestBody Election election, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
       try{
        Election createdElection = electionService.createElection(election, user);
        return ResponseEntity.ok(createdElection);
       } catch (Exception e) {
        return ResponseEntity.status(500).body(
                Map.of(
                        "error", "Election creation failed",
                        "message", e.getMessage()
                )
        );
       }
    }

    @PutMapping("activate/{id}")
    public ResponseEntity<?> activateElection(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Election activatedElection = electionService.createElection(id, user);
            return ResponseEntity.ok(activatedElection);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Election activation failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllElections(HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        if (token == null) {
            return ResponseEntity.status(403).body(
                Map.of(
                    "error", "Missing authentication token",
                    "message", "You must provide a valid token to view elections."
                )
            );
        }
        User user = authService.getUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(403).body(
                Map.of(
                    "error", "Forbidden",
                    "message", "You do not have permission to view elections."
                )
            );
        }
        try {
            return ResponseEntity.ok(electionService.getAllElections());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of(
                    "error", "Could not retrieve elections",
                    "message", e.getMessage()
                )
            );
        }
    }
}



