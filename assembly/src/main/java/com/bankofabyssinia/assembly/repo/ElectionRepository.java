package com.bankofabyssinia.assembly.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.Election;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    Optional<Election> findByName(String name);

}