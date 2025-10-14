package com.bankofabyssinia.assembly.Service;

import com.bankofabyssinia.assembly.DTO.PositionDTO;
import com.bankofabyssinia.assembly.model.*;
import com.bankofabyssinia.assembly.repo.ElectionRepository;
import com.bankofabyssinia.assembly.repo.LogRepository;
import com.bankofabyssinia.assembly.repo.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PositionService {
    @Autowired
    private PositionRepository positionRepo;

    @Autowired
    private ElectionRepository electionRepo;

    @Autowired
    private LogRepository logRepo;

    public Position createPosition(PositionDTO positionDTO, User user) {
//        Election election = electionRepo.findById(positionDTO.getElectionId()).get();

        Position position = new Position();
        position.setName(positionDTO.getName());
//        position.setElection(election);
        position.setStatus(ElectionStatus.OPEN);
        position.setDescription(positionDTO.getDescription());
        position.setMaxVotes(positionDTO.getMaxVotes());
        position.setMaxCandidates(positionDTO.getMaxCandidates());
        position.setElection(electionRepo.findById(positionDTO.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + positionDTO.getElectionId())));

        Log log = new Log();
        log.setAction("Created Position with name: " + position.getName());
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepo.save(log);


        return positionRepo.save(position);
    }

    public Position updatePosition(PositionDTO positionDTO, Long id, User user) {
        Position position = positionRepo.findById(id).get();
//        Election election = electionRepo.findById(positionDTO.getElectionId()).get();

        position.setName(positionDTO.getName());
//        position.setElection(election);
        position.setDescription(positionDTO.getDescription());
        position.setMaxVotes(positionDTO.getMaxVotes());
        position.setMaxCandidates(positionDTO.getMaxCandidates());

        Log log = new Log();
        log.setAction("Updated Position with ID: " + position.getId());
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepo.save(log);

        return positionRepo.save(position);
    }

    public Position activatePosition(Long id, User user) {
        Position position = positionRepo.findById(id).get();

        // Check the current status of the position
        if (position.getStatus() == ElectionStatus.OPEN) {
            throw new IllegalStateException("Position is already active.");
        } else if (position.getStatus() == ElectionStatus.CLOSED) {
            throw new IllegalStateException("Cannot activate a closed position.");
        }

        position.setStatus(ElectionStatus.OPEN);

        Log log = new Log();
        log.setAction("Activated Position with ID: " + position.getId());
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepo.save(log);

        return positionRepo.save(position);
    }

    public Position closePosition(Long id, User user) {
        Position position = positionRepo.findById(id).get();

        // Check the current status of the position
        if (position.getStatus() == ElectionStatus.CLOSED) {
            throw new IllegalStateException("Position is already closed.");
        } else if (position.getStatus() == ElectionStatus.DRAFT) {
            throw new IllegalStateException("Cannot close a draft position.");
        }

        position.setStatus(ElectionStatus.CLOSED);

        Log log = new Log();
        log.setAction("Closed Position with ID: " + position.getId());
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepo.save(log);
        return positionRepo.save(position);
    }

    public List<Position> getActivePositions(User user) {
        List<Position> activePositions = positionRepo.findByStatus(ElectionStatus.OPEN);

        Log log = new Log();
        log.setAction("Retrieved all active Positions");
        log.setUser(user);
        log.setTimestamp(java.time.Instant.now());
        logRepo.save(log);

        return activePositions;
        
    }
}
