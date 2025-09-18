package com.bankofabyssinia.assembly_vote_service.Controller;

import com.bankofabyssinia.assembly_vote_service.DTO.VoterRegisterRequest;
import com.bankofabyssinia.assembly_vote_service.Entity.User;
import com.bankofabyssinia.assembly_vote_service.Entity.Voter;
import com.bankofabyssinia.assembly_vote_service.Exception.VoterNotFoundException;
import com.bankofabyssinia.assembly_vote_service.Service.AuthService;
import com.bankofabyssinia.assembly_vote_service.Service.VoterService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/voter")
public class VoterController {
    @Autowired
    private VoterService voterService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registervoter (@RequestBody Voter voter, HttpServletRequest httpServletRequest) {
        String token = authService.getToken(httpServletRequest);
        User user = authService.getUserFromToken(token);
        try{
            Voter registeredVoter = voterService.registerVoter(voter, user);
            return ResponseEntity.ok(registeredVoter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", e.getMessage(),
                            "message", "Registration failed"
                    )
            );
        }
    }

    @GetMapping
    public ResponseEntity<?> listOfVoter(HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            List<Voter> voters = voterService.getAllVoters(user);
            return ResponseEntity.ok(voters);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", e.getMessage(),
                            "message", "Could not retrieve voters"
                    )
            );
        }
    }

    // find voter by shareholder id
    @GetMapping("/{shareholderId}")
    public ResponseEntity<?> getVoterByShareholderId(@PathVariable String shareholderId,
                                                        HttpServletRequest requestHeader) {
            String token = requestHeader.getHeader("Authorization").substring(7);
            User user = authService.getUserFromToken(token);
            try {
                Voter voter = voterService.getVoterByShareholderId(shareholderId, user);
                return ResponseEntity.ok(voter);
            } catch (VoterNotFoundException e) {
                return ResponseEntity.status(404).body(
                        Map.of(
                                "error", "Voter not found",
                                "message", e.getMessage()
                        )
                );
            }
            catch (Exception e) {
                return ResponseEntity.status(500).body(
                        Map.of(
                                "error", "Voter retrieval failed",
                                "message", e.getMessage()
                        )
                );
            }
        }   

    // find voter by shareholder id
}
