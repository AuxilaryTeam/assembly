package com.bankofabyssinia.assembly_vote_service.Entity;

import jakarta.persistence.*;
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
    @Column(nullable = false, unique = true)
    private String name;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private Long maxCandidates = 1L; // Set default to 1 and make not null
    @Column(nullable = false)
    private Long maxVotes;
    private ElectionStatus status;
}
