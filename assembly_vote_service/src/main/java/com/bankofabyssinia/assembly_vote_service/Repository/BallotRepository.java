package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.Ballot;
import com.bankofabyssinia.assembly_vote_service.Entity.CandidateVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BallotRepository extends JpaRepository<Ballot, Long> {
    List<Ballot> findByVoterId(Long voterId);
    Optional<Ballot> findByVoterIdAndElectionId(Long voterId, Long electionId);
}

