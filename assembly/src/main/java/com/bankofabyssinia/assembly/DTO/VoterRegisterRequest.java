package com.bankofabyssinia.assembly.DTO;

import lombok.Data;

@Data
public class VoterRegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String sharesOwned;
}
