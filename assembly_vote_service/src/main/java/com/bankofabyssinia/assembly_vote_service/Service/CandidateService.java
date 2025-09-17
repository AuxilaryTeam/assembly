 package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.DTO.CandidateAssignmentDTO;
import com.bankofabyssinia.assembly_vote_service.DTO.VoteDTO;
import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.List;

@Service
public class CandidateService {
    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private CandidateVoteRepository candidateVoteRepository;

    @Autowired
    private CandidateAssignmentRepository candidateAssignmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private VoterRepository voterRepository;



    public Candidate register(Candidate candidate, User user) {
        Log log = new Log();
        log.setAction("Registered candidate: " + candidate.getFullName());
        log.setUser(user);
        log.setTimestamp(Instant.now());
        logRepository.save(log);
        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates(User user) {
        Log log = new Log();
        log.setAction("Viewed all candidates");
        log.setUser(user);
        log.setTimestamp(Instant.now());
        logRepository.save(log);
        return candidateRepository.findAll();
    }

    public Candidate updateCandidate(Long id, Candidate candidate, User user) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));
        existingCandidate.setFullName(
                candidate.getFullName() != null ? candidate.getFullName() : existingCandidate.getFullName()
        );
        existingCandidate.setManifesto(
                candidate.getManifesto() != null ? candidate.getManifesto() : existingCandidate.getManifesto()
        );
        existingCandidate.setPhotoUrl(
                candidate.getPhotoUrl() != null ? candidate.getPhotoUrl() : existingCandidate.getPhotoUrl()
        );

        existingCandidate.setPhotoUrl(candidate.getPhotoUrl());

        Log log = new Log();
        log.setAction("Updated candidate: " + existingCandidate.getFullName());
        log.setUser(user);
        log.setTimestamp(Instant.now());
        logRepository.save(log);

        return candidateRepository.save(existingCandidate);
    }

    public CandidateAssignment assignCandidateToPosition(CandidateAssignmentDTO candidateAssignmentDTO, User user) {
        Candidate candidate = candidateRepository.findById(candidateAssignmentDTO.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + candidateAssignmentDTO.getCandidateId()));

        Position position = positionRepository.findById(candidateAssignmentDTO.getPositionId())
                .orElseThrow(() -> new RuntimeException("Position not found with id: " + candidateAssignmentDTO.getPositionId()));

        // check if the position is draft
        if (position.getStatus() != ElectionStatus.DRAFT) {
            throw new RuntimeException("Can only assign candidates to positions in DRAFT status.");
        }

        // check the number of assigned candidates to the position is less than or equal to the allowed number
        Long assignedCount = candidateAssignmentRepository.countByPosition(position);
        if (assignedCount >= position.getMaxCandidates()) {
            throw new RuntimeException("Cannot assign more candidates to this position. Limit reached.");
        } else if (candidateAssignmentRepository.existsByCandidateAndPosition(candidate, position)) {
            throw new RuntimeException("Candidate is already assigned to this position.");
        }

        CandidateAssignment candidateAssignment = new CandidateAssignment();
        candidateAssignment.setCandidate(candidate);
        candidateAssignment.setPosition(position);

        Log log = new Log();
        log.setUser(user);
        log.setAction("Assigned candidate: " + candidate.getFullName() + " to position: " + position.getName());
        log.setTimestamp(Instant.now());
        logRepository.save(log);

        return candidateAssignmentRepository.save(candidateAssignment);
    }

    public CandidateVote voteForCandidate(VoteDTO voteDTO, User user) {
        Position position = positionRepository.findById(voteDTO.getPositionId()).orElseThrow(() -> new RuntimeException("Position not found with id: " + voteDTO.getPositionId()));
        Candidate candidate = candidateRepository.findById(voteDTO.getCandidateId()).orElseThrow(() -> new RuntimeException("Candidate not found with id: " + voteDTO.getCandidateId()));
        Voter voter = voterRepository.findByShareholderid(voteDTO.getVoterShareHolderId()).orElseThrow(() -> new RuntimeException("Voter not found with id: " + voteDTO.getVoterId()));

        // check the voter is the attended
        if (!voter.getAttendance()) {
            throw new RuntimeException("Voter has not attended the election.");
        }

        // check if the position is open
        if (position.getStatus() != ElectionStatus.OPEN) {
            throw new RuntimeException("Position is not open for voting.");
        }

        CandidateAssignment candidateAssignment = candidateAssignmentRepository.findByCandidateAndPosition(candidate, position);
        // Add check for null assignment
        if (candidateAssignment == null) {
            throw new RuntimeException("Candidate is not assigned to this position.");
        }

        // check the vote of a voter for  an assignment is not greater than position.maxVotes
        Long voteCount = candidateVoteRepository.countByVoterAndPosition(voter, position);


       // one candidate can vote for one position  more than once unitl the position maxVotes is reached
        // However it can only vote for one candidate once
        if (voteCount >= position.getMaxVotes()) {
            throw new RuntimeException("Voter has reached the maximum number of votes for this position.");
        } else if (candidateVoteRepository.existsByVoterAndPositionAndAssignment(voter, position, candidateAssignment)) {
            throw new RuntimeException("Voter has already voted for this candidate in this position.");
        }

        CandidateVote candidateVote = new CandidateVote();
        candidateVote.setPosition(position);
        candidateVote.setVoter(voter);
        candidateVote.setAssignment(candidateAssignment);
        candidateVote.setCreatedAt(Instant.now());

        Log log = new Log();
        log.setUser(user);
        log.setAction("Inputted vote for candidate: " + candidate.getFullName() + " in position: " + position.getName());
        log.setTimestamp(Instant.now());
        logRepository.save(log);

        return candidateVoteRepository.save(candidateVote);
    }

    public List<Candidate> getCandidatesByPosition(Position position, User user) {
        List<CandidateAssignment> assignments = candidateAssignmentRepository.findByPosition(position);
        Log log = new Log();
        log.setAction("Viewed candidates for position: " + position.getName());
        log.setUser(user);
        log.setTimestamp(Instant.now());
        logRepository.save(log);
        return assignments.stream().map(CandidateAssignment::getCandidate).toList();
    }
}
