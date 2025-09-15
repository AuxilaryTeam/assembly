package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.DTO.BallotDTO;
import com.bankofabyssinia.assembly_vote_service.Entity.Ballot;
import com.bankofabyssinia.assembly_vote_service.Entity.Voter;
import com.bankofabyssinia.assembly_vote_service.Repository.BallotRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.ElectionRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class BallotService {
    @Autowired
    private BallotRepository ballotRepository;
    @Autowired
    private VoterRepository voterRepository;
    @Autowired
    private ElectionRepository electionRepository;

    // Ballot can be casted for diffente issue and postion by the same voter in the same election
    // However, a voter can cast only one ballot for a position or issue in a given election
    public Ballot createOrGetBallot(BallotDTO ballotDTO) {
        Voter voter = voterRepository.findById(ballotDTO.getVoterId()).orElseThrow(() -> new IllegalArgumentException("Invalid voter ID"));
        return ballotRepository.findByVoterIdAndElectionId(ballotDTO.getVoterId(), ballotDTO.getElectionId())
                .orElseGet(() -> {
                    Ballot ballot = new Ballot();
                    ballot.setVoter(voter);
                    ballot.setElection(electionRepository.findById(ballotDTO.getElectionId()).orElseThrow(() -> new IllegalArgumentException("Invalid election ID")));
                    ballot.setSubmittedAt(Instant.now());
                    return ballotRepository.save(ballot);
                });
    }
}
