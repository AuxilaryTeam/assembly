package com.bankofabyssinia.assembly_vote_service.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table
@Data
@NoArgsConstructor
public class IssueVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Voter voter;
    @ManyToOne(optional = false)
    private Issue issue;
    @Enumerated(EnumType.STRING)
    private IssueOption issueOption;
    private Instant createdAt = Instant.now();

    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id")
    private Election election;

    // ...existing code...
    // ...existing code...
}
