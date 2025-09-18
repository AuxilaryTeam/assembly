package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.IssueVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueVoteRepository extends JpaRepository<IssueVote, Long> {
    List<IssueVote> findByIssue_Id(Long issueId);

    boolean existsByVoterIdAndIssueId(Long voterId, Long id);
//    List<IssueVote> findByBallotId(Long ballotId);
}
