package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.Entity.*;
import com.bankofabyssinia.assembly_vote_service.Repository.CandidateVoteRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.IssueVoteRepository;
import com.bankofabyssinia.assembly_vote_service.Repository.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultService {
    @Autowired
    private CandidateVoteRepository candidateVoteRepository;

    @Autowired
    private IssueVoteRepository issueVoteRepository;

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private PositionRepository positionRepository;

    public Map<String, Long> tallyCandidateVotes(Long positionId, User user) {
        Position position = positionRepository.getById(positionId);
        List<Candidate> candidates = candidateService.getCandidatesByPosition(position, user);
        List<CandidateVote> votes = candidateVoteRepository.findByPosition_Id(positionId);

        // Initialize vote counts for all candidates to zero
        Map<String, Long> initialCounts = candidates.stream()
                .collect(Collectors.toMap(Candidate::getFullName, c -> 0L));

        // Tally votes
        Map<String, Long> voteCounts = votes.stream().collect(
                Collectors.groupingBy(vote -> vote.getAssignment().getCandidate().getFullName(),
                        Collectors.summingLong(vote -> vote.getVoter().getVotingsubscription().longValue()))
        );

        // Merge initial counts with actual vote counts
        initialCounts.forEach((candidate, count) ->
                initialCounts.put(candidate, count + voteCounts.getOrDefault(candidate, 0L))
        );

        return initialCounts;

//        return votes.stream().collect(Collectors.groupingBy(vote -> vote.getAssignment().getCandidate().getFullName(),
//                Collectors.summingLong(vote -> vote.getVoter().getSharesOwned())));
    }

    public Map<String, Long> tallyIssueVotes(Long issueId) {
        List<IssueVote> votes = issueVoteRepository.findByIssue_Id(issueId);
        List<String> options = List.of("YES", "NO", "ABSTAIN");

        // Initialize vote counts for all options to zero
        Map<String, Long> initialCounts = options.stream()
                .collect(Collectors.toMap(option -> option, option -> 0L));

        // Tally votes
        Map<String, Long> voteCounts = votes.stream().collect(
                Collectors.groupingBy(vote -> vote.getIssueOption().toString(),
                        Collectors.summingLong(vote -> vote.getVoter().getVotingsubscription().longValue()))
        );

        // Merge initial counts with actual vote counts
        initialCounts.forEach((option, count) ->
                initialCounts.put(option, count + voteCounts.getOrDefault(option, 0L))
        );

        return initialCounts;


//        return votes.stream().collect(
//                Collectors.groupingBy(vote -> vote.getOption().toString(),
//                        Collectors.summingLong(vote -> vote.getVoter().getSharesOwned()))
//        );
    }

    public Map<String, List<Map<String, Object>>> detailedCandidateVotes(Long positionId, User user) {
        Position position = positionRepository.getById(positionId);
        List<Candidate> candidates = candidateService.getCandidatesByPosition(position, user);
        List<CandidateVote> votes = candidateVoteRepository.findByPosition_Id(positionId);

        return candidates.stream().collect(Collectors.toMap(
                Candidate::getFullName,
                candidate -> votes.stream()
                        .filter(vote -> vote.getAssignment().getCandidate().getId().equals(candidate.getId()))
                        .map(vote -> {
                            Map<String, Object> map = new java.util.HashMap<>();
                            map.put("voter", vote.getVoter().getNameeng());
                            map.put("votePower", vote.getVoter().getVotingsubscription());
                            return map;
                        })
                        .collect(Collectors.toList())
        ));


    }
}
