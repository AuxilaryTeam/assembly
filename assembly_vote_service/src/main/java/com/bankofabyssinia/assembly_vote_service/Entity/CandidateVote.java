package com.bankofabyssinia.assembly_vote_service.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"ballot_id", "position_id"})})
@Data
@NoArgsConstructor
public class CandidateVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Voter voter;
//    @ManyToOne
//    private Election election;
    @ManyToOne(optional = false)
    private Position position;
    @ManyToOne(optional = false)
    private CandidateAssignment assignment;
    private Instant createdAt = Instant.now();
}
