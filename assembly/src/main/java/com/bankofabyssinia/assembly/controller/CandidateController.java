package com.bankofabyssinia.assembly.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankofabyssinia.assembly.DTO.CandidateAssignmentDTO;
import com.bankofabyssinia.assembly.DTO.VoteDTO;
import com.bankofabyssinia.assembly.model.Candidate;
import com.bankofabyssinia.assembly.model.CandidateAssignment;
import com.bankofabyssinia.assembly.model.CandidateVote;
import com.bankofabyssinia.assembly.model.Position;
import com.bankofabyssinia.assembly.model.User;
import com.bankofabyssinia.assembly.repo.PositionRepository;
import com.bankofabyssinia.assembly.Service.AuthService;
import com.bankofabyssinia.assembly.Service.CandidateService;
import com.bankofabyssinia.assembly.Service.ResultService;

import jakarta.servlet.http.HttpServletRequest;

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
                            "title", position.getName(),
                            "description", position.getDescription(),
                            "maxVotes",position.getMaxVotes(),
                            "status",position.getStatus(),
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


    //


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

    // get all candidate, the vote they gate and the rank based on the vote they get voted for them in a specific position
    @GetMapping("/rankings/position/{positionId}")
    public ResponseEntity<?> getCandidateRankingsByPosition(@PathVariable Long positionId, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);


        try {
            Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
            List<Map<String, Object>> rankings = resultService.candidateRankings(positionId, user);
            Long totalVoters = resultService.getTotalVotersForPosition(positionId);

            return ResponseEntity.ok(
                    Map.of(
                            "position", position.getName(),
                            "rankings", rankings,
                            "electionDate", position.getElection().getElectionDay(),
                            "totalVoters", totalVoters,
                            "totalVotes", resultService.candidateRankings(positionId, user).stream().mapToLong(r -> (Long) r.get("totalVotes")).sum()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve candidate rankings for the position",
                            "message", e.getMessage()
                    )
            );
        }
    }

    /**
     * Get information by candidate id and position id
     * including the number of votes they received and the number of voters who voted for them
     * and list of voters who voted for them
     */
    @GetMapping("/{candidateId}/position/{positionId}/info")
    public ResponseEntity<?> getCandidateInfoInPosition(@PathVariable Long candidateId, @PathVariable Long positionId, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Position position = positionRepository.findById(positionId).orElseThrow(() -> new RuntimeException("Position not found"));
            Candidate candidate = service.getCandidateById(candidateId, position,user);
            Map<String, Object> candidateInfo = resultService.candidateInfoInPosition(candidate, position, user);

            return ResponseEntity.ok(
                   candidateInfo
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve candidate info for the position",
                            "message", e.getMessage()
                    )
            );
        }
    }

}
