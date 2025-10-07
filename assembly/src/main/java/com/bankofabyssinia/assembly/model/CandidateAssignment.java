package com.bankofabyssinia.assembly.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class CandidateAssignment {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Candidate candidate;
    @ManyToOne(optional = false)
    private Position position;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id")
    private Election election;
}
