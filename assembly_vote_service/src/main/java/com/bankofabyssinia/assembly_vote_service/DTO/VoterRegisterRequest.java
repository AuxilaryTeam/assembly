package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class VoterRegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String sharesOwned;
}
