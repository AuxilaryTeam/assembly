package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.Entity.User;
import com.bankofabyssinia.assembly_vote_service.Entity.Voter;
import com.bankofabyssinia.assembly_vote_service.Entity.Log;
import com.bankofabyssinia.assembly_vote_service.Repository.LogRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoterService {
    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private LogRepository logRepository;

    public Voter registerVoter(Voter voter, User user) {
        Log log = new Log();
        log.setAction("Registered voter: " + voter.getNameeng());
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepository.save(log);

        return voterRepository.save(voter);
    }

    public List<Voter> getAllVoters(User user) {

        Log log = new Log();
        log.setAction("Viewed all voters");
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepository.save(log);

        return voterRepository.findAll();
    }


}
