package com.bankofabyssinia.assembly.model;

import jakarta.persistence.Column;
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
        @Column(length = 100)
        private String fullName;
        @Column(length = 500)
        private String manifesto;
        @Column(length = 255)
        private String photoUrl;
    private boolean active = true;
    
    // @ManyToOne(optional = false)
    // ...existing code...

    public boolean getActive() {
        return active;
    }
}
