package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.DTO.IssueDTO;
import com.bankofabyssinia.assembly_vote_service.DTO.VoteDTO;
import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class IssueService {
    @Autowired
    private IssueRepository issueRepo;
//    @Autowired
//    private IssueOptionRepository  issueOptionRepo;
    @Autowired
    private ElectionRepository electionRepository;
    @Autowired
    private IssueVoteRepository issuevoteRepo;
    @Autowired
    private VoterRepository voterRepository;
    @Autowired
    private LogRepository logRepository;
    @Autowired
    private ResultService resultService;

    public Issue createIssue(IssueDTO issueDTO, User user) {
//        Election election = electionRepository.findById(issueDTO.getElectionId())
//                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + issueDTO.getElectionId()));
        Issue issue = new Issue();
        issue.setTitle(issueDTO.getTitle());
        issue.setDescription(issueDTO.getDescription());
//        issue.setElection(election);
        issue.setStatus(ElectionStatus.DRAFT);
        Issue savedIssue = issueRepo.save(issue);

        Log log = new Log();
        log.setAction("Created Issue with ID: " + savedIssue.getId());
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return savedIssue;
    }


//    public IssueOption createIssueOption(IssueOptionDTO issueOption, User user){
//        Issue issue = issueRepo.findById(issueOption.getIssueId())
//                .orElseThrow(() -> new IllegalArgumentException("Issue not found with id: " + issueOption.getIssueId()));
//        IssueOption option = new IssueOption();
//        option.setLabel(issueOption.getLabel());
//        option.setIssue(issue);
//        IssueOption savedOption = issueOptionRepo.save(option);
//
//        Log log = new Log();
//        log.setAction("Created Issue Option with ID: " + savedOption.getId() + " for Issue ID: " + issue.getId());
//        log.setTimestamp(Instant.now());
//        log.setUser(user);
//        logRepository.save(log);
//
//        return savedOption;
//    }

    public Issue updateIssue(IssueDTO issueDTO, Long id, User user) {

    if (id == null) {
        throw new IllegalArgumentException("Issue id must not be null");
    }
    Issue issue = issueRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Issue not found with id: " + id));
        issue.setTitle(issueDTO.getTitle());
        issue.setDescription(issueDTO.getDescription());

        Log log = new Log();
        log.setAction("Updated Issue with ID: " + issue.getId());
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return issueRepo.save(issue);
    }

//    public IssueOption updateIssueOption(IssueOptionDTO optionDTO, Long id, User user) {
//        IssueOption option = issueOptionRepo.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Issue Option not found with id: " + id));
//        Issue issue = issueRepo.findById(optionDTO.getIssueId())
//                .orElseGet(issueRepo.findById(option.getIssue().getId())::get);
//
//        option.setIssue(issue);
//        option.setLabel(optionDTO.getLabel());
//
//        Log log = new Log();
//        log.setAction("Updated Issue Option with ID: " + option.getId());
//        log.setTimestamp(Instant.now());
//        log.setUser(user);
//        logRepository.save(log);
//
//        return issueOptionRepo.save(option);
//    }

    public Map getIssueById(Long id, User user) {

    if (id == null) {
        throw new IllegalArgumentException("Issue id must not be null");
    }
    Issue issue = issueRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Issue not found with id: " + id));




       // List of IssueOption from enum
        List<IssueOption> options = List.of(IssueOption.YES, IssueOption.NO, IssueOption.ABSTAIN);
        Map <String, Long> results = resultService.tallyIssueVotes(id);

        Log log = new Log();
        log.setAction("Retrieved Issue with ID: " + issue.getId());
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return  Map.of(
                "Issue Title", issue.getTitle(),
                "Issue Description", issue.getDescription(),
                "option with results", results,
                "Status", issue.getStatus().name()
        );
    }



    public IssueVote voteForIssue(Issue issue, VoteDTO issueVote, User user) {

        if (issue.getStatus() != ElectionStatus.OPEN) {
            throw new IllegalStateException("Cannot vote on a non-active issue");
        }

        // check if the voter has already voted on this issue
        boolean hasVoted = issuevoteRepo.existsByVoterIdAndIssueId(issueVote.getVoterId(), issue.getId());
        if (hasVoted) {
            throw new IllegalStateException("Voter has already voted on this issue");
        }

        // find enum value by id
        IssueOption option = switch (issueVote.getOptionId().intValue()) {
            case 1 -> IssueOption.YES;
            case 2 -> IssueOption.NO;
            case 3 -> IssueOption.ABSTAIN;
            default -> throw new IllegalArgumentException("Invalid option id: " + issueVote.getOptionId());
        };

        Voter voter = voterRepository.findByShareholderid(issueVote.getVoterShareHolderId())
                .orElseThrow(() -> new IllegalArgumentException("Voter not found with id: " + issueVote.getVoterId()));

        // check the voter is the attended
        if (!voter.getAttendance()){
            throw new IllegalStateException("Voter has not attended the election.");
        }

        IssueVote vote = new IssueVote();
        vote.setIssue(issue);
//        vote.setElection(issue.getElection());
        vote.setIssueOption(option);
        vote.setVoter(voter);
        vote.setCreatedAt(Instant.now());

        Log log = new Log();
        log.setAction("Voter with ID: " + voter.getId() + " voted on Issue with ID: " + issue.getId());
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return issuevoteRepo.save(vote);
    }


    public Issue activateIssue(Long id, User user) {

    // check if the Issue is already active
    if (id == null) {
        throw new IllegalArgumentException("Issue id must not be null");
    }
    Issue issue = issueRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Issue not found with id: " + id));

        if (issue.isActive()) {
            throw new IllegalStateException("Issue is already active");
        } else if (issue.getStatus() == ElectionStatus.CLOSED) {
            throw new IllegalStateException("Cannot activate a closed issue");
        }

        issue.setStatus(ElectionStatus.OPEN);

        Log log = new Log();
        log.setAction("Activated Issue with ID: " + issue.getId());
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return issueRepo.save(issue);
    }

    public Issue closeIssue(Long id, User user) {

    // check if the Issue is already closed
    if (id == null) {
        throw new IllegalArgumentException("Issue id must not be null. I cant find it NAOD");
    }
    Issue issue = issueRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Issue not found with id: " + id));

        if (issue.getStatus() == ElectionStatus.CLOSED) {
            throw new IllegalStateException("Issue is already closed");
    }
        issue.setStatus(ElectionStatus.CLOSED);

        Log log = new Log();
        log.setAction("Closed Issue with ID: " + issue.getId());
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return issueRepo.save(issue);
    }


    public List<Issue> getActiveIssues(User user) {
        List<Issue> activeIssues = issueRepo.findByStatus(ElectionStatus.OPEN);

        Log log = new Log();
        log.setAction("Retrieved all active Issues");
        log.setTimestamp(Instant.now());
        log.setUser(user);
        logRepository.save(log);

        return activeIssues;
    }
}
