package com.bankofabyssinia.assembly.model;

import java.time.Instant;
import java.time.LocalDate;



import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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