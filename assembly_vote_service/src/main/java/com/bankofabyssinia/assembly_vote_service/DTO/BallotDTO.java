package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class BallotDTO {
    private Long voterId;
    private Long electionId;
}
