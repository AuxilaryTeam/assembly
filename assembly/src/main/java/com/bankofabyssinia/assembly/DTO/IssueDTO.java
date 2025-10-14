package com.bankofabyssinia.assembly.DTO;

import lombok.Data;

@Data
public class IssueDTO {
    private Long id;
    private String title;
    private String description;
    private Long electionId;
//    private Long electionId;
}
