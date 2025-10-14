package com.bankofabyssinia.assembly.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "app_user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
        @Column(length = 50)
        private String firstName;
        @Column(length = 50)
        private String lastName;
        @Column(unique = true, nullable = true, length = 100)
        private String email;

        @Column(unique = true, nullable = true, length = 50)
        private String username;

    //    @JsonIgnore
        @Column(length = 100)
        private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
