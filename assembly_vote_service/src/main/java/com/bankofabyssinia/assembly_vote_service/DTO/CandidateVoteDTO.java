package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class CandidateVoteDTO {
    private Long voterId;
    private Long electionId;
    private Long positionId;
    private Long assignmentId;
}
