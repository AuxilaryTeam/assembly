package com.bankofabyssinia.assembly.DTO;

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
