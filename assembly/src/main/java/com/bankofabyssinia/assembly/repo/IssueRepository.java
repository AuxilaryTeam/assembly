package com.bankofabyssinia.assembly.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.ElectionStatus;
import com.bankofabyssinia.assembly.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByStatus(ElectionStatus electionStatus);
}
