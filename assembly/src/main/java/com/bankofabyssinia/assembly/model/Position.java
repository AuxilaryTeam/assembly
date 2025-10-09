package com.bankofabyssinia.assembly.model;

import jakarta.persistence.Column;
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
public class Position {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
//    @ManyToOne(optional = false)
//    private Election election;
    private String name;
    private String description;
    @Column(nullable = false)
    private Long maxCandidates = 1L; // Set default to 1 and make not null
    @Column(nullable = false)
    private Long maxVotes;
    private ElectionStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id")
    private Election election;
}
