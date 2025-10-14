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
public class Issue {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
//    @ManyToOne(optional = false)
//    private Election election;
    @Column(nullable = false, unique = true)
    private String title;
    private String description;
    private ElectionStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id")
    private Election election;

    public boolean isActive() {
        return this.status == ElectionStatus.OPEN;
    }
}
