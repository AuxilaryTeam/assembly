package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
