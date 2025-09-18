package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class IssueDTO {
    private Long id;
    private String title;
    private String description;
//    private Long electionId;
}
