package com.bankofabyssinia.assembly_vote_service.Controller;

import com.bankofabyssinia.assembly_vote_service.DTO.IssueDTO;
import com.bankofabyssinia.assembly_vote_service.DTO.IssueOptionDTO;
import com.bankofabyssinia.assembly_vote_service.DTO.VoteDTO;
import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.IssueRepository;
import com.bankofabyssinia.assembly_vote_service.Service.AuthService;
import com.bankofabyssinia.assembly_vote_service.Service.IssueService;
import com.bankofabyssinia.assembly_vote_service.Service.ResultService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issue")
public class IssueController {
    @Autowired
    private IssueService issueService;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private ResultService resultService;


    @PostMapping("/createIssue")
    public ResponseEntity<?> createIssue(@RequestBody IssueDTO issueDTO, HttpServletRequest requestHeader) {
        String token = requestHeader.getHeader("Authorization").substring(7);
        User user = authService.getUserFromToken(token);
        try {
            Issue createdIssue = issueService.createIssue(issueDTO, user);
            return ResponseEntity.ok(createdIssue);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Issue creation failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

//    @PostMapping("/createOption")
//    public ResponseEntity<?> createIssueOption(@RequestBody IssueOptionDTO option, HttpServletRequest requestHeader) {
//        String token = authService.getToken(requestHeader);
//        User user = authService.getUserFromToken(token);
//        try {
//            IssueOption createdOption = issueService.createIssueOption(option, user);
//            return ResponseEntity.ok(createdOption);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(
//                    Map.of(
//                            "error", "Issue option creation failed",
//                            "message", e.getMessage()
//                    )
//            );
//        }
//    }

    @PutMapping("/updateIssue/{id}")
    public ResponseEntity<?> updateIssue(@RequestBody IssueDTO issueDTO, @PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Issue updatedIssue = issueService.updateIssue(issueDTO, id, user);
            return ResponseEntity.ok(updatedIssue);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Issue update failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

//    @PutMapping("/updateOption/{id}")
//    public ResponseEntity<?> updateIssueOption(@RequestBody IssueOptionDTO optionDTO, @PathVariable Long id, HttpServletRequest requestHeader) {
//        String token = authService.getToken(requestHeader);
//        User user = authService.getUserFromToken(token);
//        try {
//            IssueOption updatedOption = issueService.updateIssueOption(optionDTO, id, user);
//            return ResponseEntity.ok(updatedOption);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(
//                    Map.of(
//                            "error", "Issue option update failed",
//                            "message", e.getMessage()
//                    )
//            );
//        }
//
//    }

    // get issue by id
    @GetMapping("/getIssue/{id}")
    public ResponseEntity<?> getIssueById(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Map issue = issueService.getIssueById(id, user);
            return ResponseEntity.ok(issue);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    Map.of(
                            "error", "Issue not found",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // voter vote for issue
    @PostMapping("/vote")
    public ResponseEntity<?> voteForIssue(VoteDTO voteDTO, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Issue issue = issueRepository.findById(voteDTO.getIssueId()).orElseThrow(() -> new RuntimeException("Issue not found with id: " + voteDTO.getIssueId()));
            IssueVote vote = issueService.voteForIssue(issue, voteDTO, user);
            return ResponseEntity.ok(vote);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Voting failed",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // result for issue
    @GetMapping("/result/{id}")
    public ResponseEntity<?> getIssueResult(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));
            Map<String, Long> result = resultService.tallyIssueVotes(id);
            return ResponseEntity.ok(
                    Map.of(
                            "issue", issue.getTitle(),
                            "result", result
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve issue result",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // activate issue
    @PutMapping("/activate/{id}")
    public ResponseEntity<?> activateIssue(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        Role role = authService.getRoleFromToken(token);
        if (!role.getName().equals("ADMIN")) {
            return ResponseEntity.status(403).body(
                    Map.of(
                            "error", "Forbidden",
                            "message", "You do not have permission to activate issues"
                    )
            );
        }
        try {
            Issue activatedIssue = issueService.activateIssue(id, user);
            return ResponseEntity.ok(activatedIssue);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not activate issue",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // close issue
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeIssue(@PathVariable Long id, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        Role role = authService.getRoleFromToken(token);
        if (!role.getName().equals("ADMIN")) {
            return ResponseEntity.status(403).body(
                    Map.of(
                            "error", "Forbidden",
                            "message", "You do not have permission to close issues"
                    )
            );
        }
        try {
            Issue closedIssue = issueService.closeIssue(id, user);
            return ResponseEntity.ok(closedIssue);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not close issue",
                            "message", e.getMessage()
                    )
            );
        }
    }

    // get active issues
    @GetMapping("/active")
    public ResponseEntity<?> getActiveIssues(HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        try {
            List<Issue> activeIssues = issueService.getActiveIssues(user);
            return ResponseEntity.ok(activeIssues);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", "Could not retrieve active issues",
                            "message", e.getMessage()
                    )
            );
        }
    }
}