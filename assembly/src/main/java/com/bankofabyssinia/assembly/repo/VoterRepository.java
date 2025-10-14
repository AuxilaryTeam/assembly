package com.bankofabyssinia.assembly.repo;

import com.bankofabyssinia.assembly.model.Sherholderdetail;
import com.bankofabyssinia.assembly.model.Voter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoterRepository extends JpaRepository<Voter, Long> {
    Optional<Voter> findById(Long id);

    Optional<Voter> findByShareholderid(String shareholderId);

    // List<Voter> findDistinctVotersByCandidateVotes_Assignment_Position_Id(Long positionId);
}
