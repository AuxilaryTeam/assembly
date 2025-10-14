package com.bankofabyssinia.assembly.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private String fullName;
    private String email;
    private String token;
    private String refreshToken;
    private String roleId;
    private String roleName;
}
