package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateVoteRepository extends JpaRepository<CandidateVote, Long>{
    List<CandidateVote> findByPosition_Id(Long positionId);

    boolean existsByVoterAndAssignment(Voter voter, CandidateAssignment candidateAssignment);

    Long countByVoterAndPosition(Voter voter, Position position);

    boolean existsByVoterAndPositionAndAssignment(Voter voter, Position position, CandidateAssignment candidateAssignment);
//    List<CandidateVote> findByBallot_Id(Long ballotId);

    List<CandidateVote> findByVoterId(Long id);

    List<CandidateVote> findByVoterIdAndPosition(Long id, Position position);
}
