package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.Candidate;
import com.bankofabyssinia.assembly_vote_service.Entity.CandidateAssignment;
import com.bankofabyssinia.assembly_vote_service.Entity.Issue;
import com.bankofabyssinia.assembly_vote_service.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateAssignmentRepository extends JpaRepository<CandidateAssignment, Long> {
//    List<CandidateAssignment> findByElectionIdAndPositionId(Long electionId, Long positionId);

    CandidateAssignment findByCandidateAndPosition(Candidate candidate, Position position);

    List<CandidateAssignment> findByPosition(Position position);

    Long countByPosition(Position position);

    boolean existsByCandidateAndPosition(Candidate candidate, Position position);
}

