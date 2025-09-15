package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class IssueVoteDTO {
    private Long voterId;
    private Long electionId;
    private Long issueId;
    private Long optionId;
}
