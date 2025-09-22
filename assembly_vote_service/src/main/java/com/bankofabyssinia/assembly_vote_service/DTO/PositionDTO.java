package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class PositionDTO {
    private String name;
    private String description;
//    private Long electionId;
    private Long maxVotes;
    private Long maxCandidates;
    private Long electionId;
}
