package com.bankofabyssinia.assembly.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.Candidate;
import com.bankofabyssinia.assembly.model.CandidateAssignment;
import com.bankofabyssinia.assembly.model.Position;

public interface CandidateAssignmentRepository extends JpaRepository<CandidateAssignment, Long> {
//    List<CandidateAssignment> findByElectionIdAndPositionId(Long electionId, Long positionId);

    CandidateAssignment findByCandidateAndPosition(Candidate candidate, Position position);

    List<CandidateAssignment> findByPosition(Position position);

    Long countByPosition(Position position);

    boolean existsByCandidateAndPosition(Candidate candidate, Position position);
}
