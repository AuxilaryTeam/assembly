package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class VoteDTO {
    private Long voterId;
    private Long positionId;
    private Long candidateId; // For candidate elections
    private Long IssueId;   // For issue elections
    private Long optionId;  // For issue elections
}
