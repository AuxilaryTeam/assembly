package com.bankofabyssinia.assembly.DTO;

import lombok.Data;

@Data
public class CandidateVoteDTO {
    private Long voterId;
    private Long electionId;
    private Long positionId;
    private Long assignmentId;
}
