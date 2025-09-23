package com.bankofabyssinia.assembly_vote_service.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bankofabyssinia.assembly_vote_service.Entity.CandidateVote;
import com.bankofabyssinia.assembly_vote_service.Entity.Log;
import com.bankofabyssinia.assembly_vote_service.Entity.Position;
import com.bankofabyssinia.assembly_vote_service.Entity.User;
import com.bankofabyssinia.assembly_vote_service.Entity.Voter;
import com.bankofabyssinia.assembly_vote_service.Exception.PositionNotFoundException;
import com.bankofabyssinia.assembly_vote_service.Exception.VoterNotFoundException;
import com.bankofabyssinia.assembly_vote_service.Repository.CandidateVoteRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.LogRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.PositionRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.VoterRepository;

@Service
public class VoterService {
    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private CandidateVoteRepository candidateVoteRepository;

    @Autowired
    private PositionRepository positionRepository;

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

    // find voter by shareholder id
    public Voter getVoterByShareholderId(String shareholderId, User user) {
        // Log log = new Log();
        // log.setAction("Searched for voter with shareholder ID: " + shareholderId);
        // log.setUser(user);
        // log.setTimestamp(java.time.Instant.now());
        // logRepository.save(log);

        return voterRepository.findByShareholderid(shareholderId)
                .orElseThrow(() -> new VoterNotFoundException("Voter not found with shareholder ID: " + shareholderId));
    }

    // VOTER VOTING HISTORY
    public List<?> getVoterHistoryByPosition (Long positionId, User user) {
        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new PositionNotFoundException("Position not found with ID: " + positionId));

        List<Voter> allVoters = candidateVoteRepository.findDistinctVotersByPosition_Id(positionId);

        List<Map<String, Object>> votingHistory = new ArrayList<>();

        for (Voter v : allVoters) {

            // List of votes in CandidateVote in candidateVoteRepository where voter_id = v.getId()
            List<CandidateVote> votes = candidateVoteRepository.findByVoterIdAndPosition(v.getId(), position);

            // I want to map the list of votes to a map with voter details and their votes
            List<Map<String, Object>> mappedVotes = new ArrayList<>();
            for (CandidateVote vote : votes) {
                Map<String, Object> voteMap = Map.of(
                        "voteId", vote.getId(),
                        "candidateName", vote.getAssignment().getCandidate().getFullName(),
                        "Vote", vote.getVoter().getVotingsubscription()
                        
                );
                mappedVotes.add(voteMap);
            }

            Map<String, Object> voterHistory = Map.of(
                    "voterId", v.getId(),
                    "shareholderId", v.getShareholderid(),
                    "nameEng", v.getNameeng(),
                    "nameAmh", v.getNameamh(),
                    "votedCandidates", mappedVotes
                    // Add more fields as necessary
            );

            votingHistory.add(voterHistory);
        }

        Log log = new Log();
                log.setAction("Retrieved voting history for all voters");
                log.setUser(user);
                log.setTimestamp(java.time.Instant.now());
                logRepository.save(log);

        return votingHistory;
    }

    public Map<String, Object> getVoterHistoryByPositionPaginated(Long positionId, User user, int pageNumber,
            int pageSize) {
        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new IllegalArgumentException("Position not found with ID: " + positionId));

        // List<Voter> allVoters = voterRepository.findAll();
        List<Voter> allVoters = candidateVoteRepository.findDistinctVotersByPosition_Id(positionId);

        int totalVoters = allVoters.size();
        int totalPages = (int) Math.ceil((double) totalVoters / pageSize);
        int fromIndex = (pageNumber - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalVoters);
        List<Voter> paginatedVoters = allVoters.subList(fromIndex, toIndex);
        List<Map<String, Object>> votingHistory = new ArrayList<>();
        for (Voter v : paginatedVoters) {

            // List of votes in CandidateVote in candidateVoteRepository where voter_id = v.getId()
            List<CandidateVote> votes = candidateVoteRepository.findByVoterIdAndPosition(v.getId(), position);

            // I want to map the list of votes to a map with voter details and their votes
            List<Map<String, Object>> mappedVotes = new ArrayList<>();
            for (CandidateVote vote : votes) {
                Map<String, Object> voteMap = Map.of(
                        "voteId", vote.getId(),
                        "candidateName", vote.getAssignment().getCandidate().getFullName(),
                        "Vote", vote.getVoter().getVotingsubscription()
                );
                mappedVotes.add(voteMap);
            }

            Map<String, Object> voterHistory = Map.of(
                    "voterId", v.getId(),
                    "shareholderId", v.getShareholderid(),
                    "nameEng", v.getNameeng(),
                    "nameAmh", v.getNameamh(),
                    "votedCandidates", mappedVotes
                    // Add more fields as necessary
            );

            votingHistory.add(voterHistory);
        }
        
        return Map.of(
                "currentPage", pageNumber,
                "totalPages", totalPages,
                "pageSize", pageSize,
                "totalVoters", totalVoters,
                "electionDate", position.getElection().getElectionDay(),
                "votingHistory", votingHistory
        );
    }

}
