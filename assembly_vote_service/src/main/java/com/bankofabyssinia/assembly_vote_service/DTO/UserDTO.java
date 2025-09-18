package com.bankofabyssinia.assembly_vote_service.DTO;

import lombok.Data;

@Data
public class UserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private Long roleId;
}
