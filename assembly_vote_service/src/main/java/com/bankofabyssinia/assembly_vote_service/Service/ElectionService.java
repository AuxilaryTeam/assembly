package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.ElectionRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ElectionService {
    @Autowired
    private ElectionRepository electionRepo;

    @Autowired
    private LogRepository logRepo;

    public Election createElection(Election election, User user) {
        Log log = new Log();
        log.setUser(user);
        log.setAction("Created election with title: " + election.getName());
        log.setTimestamp(Instant.now());
        logRepo.save(log);

        
        election.setCreatedBy(user);

        return electionRepo.save(election);
    }

    public Election createElection(Long id, User user) {
        Election election = electionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + id));
        election.setStatus(ElectionStatus.OPEN);

        Log log = new Log();
        log.setUser(user);
        log.setAction("Activated election with ID: " + election.getId());
        log.setTimestamp(Instant.now());
        logRepo.save(log);

        return electionRepo.save(election);
    }
}
