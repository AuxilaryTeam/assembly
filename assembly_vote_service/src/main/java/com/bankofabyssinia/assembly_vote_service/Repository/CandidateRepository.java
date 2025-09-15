package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.Candidate;
import com.bankofabyssinia.assembly_vote_service.Entity.CandidateAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

}
