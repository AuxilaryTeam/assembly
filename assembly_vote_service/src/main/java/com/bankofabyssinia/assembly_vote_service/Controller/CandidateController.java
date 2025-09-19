package com.bankofabyssinia.assembly_vote_service.Controller;

import com.bankofabyssinia.assembly_vote_service.DTO.CandidateAssignmentDTO;
import com.bankofabyssinia.assembly_vote_service.DTO.VoteDTO;
import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.PositionRepository;
import com.bankofabyssinia.assembly_vote_service.Service.AuthService;
import com.bankofabyssinia.assembly_vote_service.Service.CandidateService;
import com.bankofabyssinia.assembly_vote_service.Service.ResultService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")

public class CandidateController {

    @Autowired
    private CandidateService service;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private ResultService resultService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Candidate candidate, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Candidate savedCandidate = service.register(candidate, user);
            return ResponseEntity.ok(savedCandidate);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Registration failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

    @GetMapping
    public ResponseEntity<?> listAllCandidate(HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            List<Candidate> candidates = service.getAllCandidates(user);
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve candidates",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // update candidate
    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateCandidate(@RequestBody Candidate candidate, @PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Candidate updatedCandidate = service.updateCandidate(id, candidate, user);
            return ResponseEntity.ok(updatedCandidate);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not update candidate",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // candidate assignment to position
    @PostMapping("/assign")
    public ResponseEntity<?> assignCandidate(@RequestBody CandidateAssignmentDTO candidateAssignmentDTO, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            CandidateAssignment assignment = service.assignCandidateToPosition(candidateAssignmentDTO, user);
            return ResponseEntity.ok(assignment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not assign candidate",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // vote for candidate for a specific position
    @PostMapping("/vote")
    public ResponseEntity<?> voteForCandidate(@RequestBody VoteDTO voteDTO, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            CandidateVote vote = service.voteForCandidate(voteDTO, user);
            return ResponseEntity.ok(
                    Map.of(
                            "message", "Vote recorded successfully",
                            "voter", vote.getVoter().getNameeng(),
                            "position", vote.getAssignment().getPosition().getName(),
                            "candidate", vote.getAssignment().getCandidate().getFullName(),
                            "Vote power", vote.getVoter().getVotingsubscription()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not record vote",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // find list of candidates by position id
    @GetMapping("/position/{positionId}")
    public ResponseEntity<?> getCandidatesByPosition(@PathVariable Long positionId, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
            List<Candidate> candidates = service.getCandidatesByPosition(position, user);

            return ResponseEntity.ok(
                    Map.of(
                            "position", position.getName(),
                            "candidates", candidates
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve candidates for the position",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // get the result of a position by id
    @GetMapping("/results/position/{positionId}")
    public ResponseEntity<?> getResultsByPosition(@PathVariable Long positionId, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
            Map<String, Long> results = resultService.tallyCandidateVotes(positionId, user);

            return ResponseEntity.ok(
                    Map.of(
                            "position", position.getName(),
                            "results", results
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve results for the position",
                            "message", e.getMessage()
                    )
            );
        }

    }


    // get the all asigned candideats to a position
    @GetMapping("/assignments/position/{positionId}")
    public ResponseEntity<?> getAssignmentsByPosition(@PathVariable Long positionId, HttpServletRequest
            requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
            List<Candidate> candidates = service.getAssignmentsByPosition(position, user);

            return ResponseEntity.ok(
                    Map.of(
                            "position", position.getName(),
                            "assignments", candidates
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve assignments for the position",
                            "message", e.getMessage()
                    )
            );
        }
    }


    // report for who voted for candidate in each position
    public ResponseEntity<?> getDetailedResultsByPosition(@PathVariable Long positionId, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
            Map<String, List<Map<String, Object>>> detailedResults = resultService.detailedCandidateVotes(positionId, user);

            return ResponseEntity.ok(
                    Map.of(
                            "position", position.getName(),
                            "detailedResults", detailedResults
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve detailed results for the position",
                            "message", e.getMessage()
                    )
            );
        }
    }

}
