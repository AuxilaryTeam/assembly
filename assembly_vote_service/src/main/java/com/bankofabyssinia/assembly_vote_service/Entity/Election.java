package com.bankofabyssinia.assembly_vote_service.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    // @Enumerated(EnumType.STRING)
    // private ElectionType type; // ISSUE or CANDIDATE
    @Enumerated(EnumType.STRING)
    private ElectionStatus status; // ACTIVE, INACTIVE, COMPLETED
    
    private LocalDate electionDay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    private Instant createdAt = Instant.now();
}
