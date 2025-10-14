package com.bankofabyssinia.assembly.DTO;

import lombok.Data;

@Data
public class IssueVoteDTO {
    private Long voterId;
    private Long electionId;
    private Long issueId;
    private Long optionId;
}
