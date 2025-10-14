package com.bankofabyssinia.assembly.DTO;

import lombok.Data;

@Data
public class PositionDTO {
    private String name;
    private String description;
    private Long maxVotes;
    private Long maxCandidates;
    private Long electionId;
}
