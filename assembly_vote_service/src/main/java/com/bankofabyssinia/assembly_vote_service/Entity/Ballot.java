// package com.bankofabyssinia.assembly_vote_service.Entity;

// import jakarta.persistence.*;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.Instant;

// @Entity
// @Table(name="ballot", uniqueConstraints = {@UniqueConstraint(columnNames = {"voter_id", "election_id"})})
// @Data
// @NoArgsConstructor
// public class Ballot {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
//     @ManyToOne(optional = false)
//     private Election election;
//     @ManyToOne(optional = false)
//     private Voter voter;
//     private Instant submittedAt;
// }
