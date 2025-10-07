package com.bankofabyssinia.assembly.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Candidate {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String manifesto;
    private String photoUrl;
    private boolean active = true;
    
    // @ManyToOne(optional = false)
    // ...existing code...

    public boolean getActive() {
        return active;
    }
}
