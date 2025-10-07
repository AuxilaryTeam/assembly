package com.bankofabyssinia.assembly.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bankofabyssinia.assembly.model.CandidateAssignment;
import com.bankofabyssinia.assembly.model.CandidateVote;
import com.bankofabyssinia.assembly.model.Position;
import com.bankofabyssinia.assembly.model.Sherholderdetail;
import com.bankofabyssinia.assembly.model.Voter;

public interface CandidateVoteRepository extends JpaRepository<CandidateVote, Long>{
    List<CandidateVote> findByPosition_Id(Long positionId);

    boolean existsByVoterAndAssignment(Voter voter, CandidateAssignment candidateAssignment);

    Long countByVoterAndPosition(Voter voter, Position position);

    boolean existsByVoterAndPositionAndAssignment(Voter voter, Position position, CandidateAssignment candidateAssignment);
//    List<CandidateVote> findByBallot_Id(Long ballotId);

    List<CandidateVote> findByVoterId(Long id);

    List<CandidateVote> findByVoterIdAndPosition(Long id, Position position);

    Long countDistinctVotersByPosition_Id(Long positionId);

    // List<Voter> findDistinctVotersByCandidateVotes_Assignment_Position_Id(Long positionId);

    @Query("SELECT DISTINCT cv.voter FROM CandidateVote cv WHERE cv.position.id = :positionId")
    List<Voter> findDistinctVotersByPosition_Id(@Param("positionId") Long positionId);
}
