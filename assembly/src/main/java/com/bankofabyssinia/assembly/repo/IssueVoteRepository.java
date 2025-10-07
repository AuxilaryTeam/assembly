package com.bankofabyssinia.assembly.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.IssueVote;

public interface IssueVoteRepository extends JpaRepository<IssueVote, Long> {
    List<IssueVote> findByIssue_Id(Long issueId);

    boolean existsByVoterIdAndIssueId(Long voterId, Long id);
//    List<IssueVote> findByBallotId(Long ballotId);
}
