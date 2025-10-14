package com.bankofabyssinia.assembly.DTO;

import lombok.Data;

@Data
public class VoteDTO {
    private Long voterId;
    private String voterShareHolderId;
    private Long positionId;
    private Long candidateId; // For candidate elections
    private Long IssueId;   // For issue elections
    private Long optionId;  // For issue elections
}
