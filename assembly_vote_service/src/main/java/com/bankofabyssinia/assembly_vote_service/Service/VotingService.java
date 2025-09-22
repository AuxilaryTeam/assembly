package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.DTO.CandidateVoteDTO;
import com.bankofabyssinia.assembly_vote_service.DTO.IssueVoteDTO;
import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authorization.method.AuthorizeReturnObject;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
public class VotingService {
    // @Autowired
    // private BallotRepository ballotRepository;

    @Autowired
    private CandidateVoteRepository candidateVoteRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private CandidateAssignmentRepository assignmentRepository;



    @Autowired
    private IssueVoteRepository issueVoteRepository;



    public CandidateVote castCandidateVote(CandidateVoteDTO voteDTO) {
        CandidateVote vote = new CandidateVote();
        vote.setVoter(voterRepository.findById(voteDTO.getVoterId()).get());
//        vote.setElection(electionRepository.findById(voteDTO.getElectionId()).get());
        vote.setPosition(positionRepository.findById(voteDTO.getPositionId()).get());
        vote.setAssignment(assignmentRepository.findById(voteDTO.getAssignmentId()).get());
        return candidateVoteRepository.save(vote);
    }

    public IssueVote castIssueVote(IssueVoteDTO voteDTO) {
        IssueVote vote = new IssueVote();
        vote.setVoter(voterRepository.findById(voteDTO.getVoterId()).get());
//        vote.setElection(electionRepository.findById(voteDTO.getElectionId()).get());
        vote.setIssue(issueRepository.findById(voteDTO.getIssueId()).get());
        // get option by vote.getOptionID() from issue options
       vote.setIssueOption(
               switch (voteDTO.getOptionId().intValue()) {
                   case 1 -> IssueOption.YES;
                   case 2 -> IssueOption.NO;
                   case 3 -> IssueOption.ABSTAIN;
                   default -> throw new IllegalArgumentException("Invalid option id: " + voteDTO.getOptionId());
               }
       );

        return issueVoteRepository.save(vote);
    }

}
