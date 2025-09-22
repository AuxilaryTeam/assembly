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


}
