package com.bankofabyssinia.assembly.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

}

