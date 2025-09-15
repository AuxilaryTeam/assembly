package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface VoterRepository extends JpaRepository<Voter, Long> {
    Optional<Voter> findById(Long id);
}
