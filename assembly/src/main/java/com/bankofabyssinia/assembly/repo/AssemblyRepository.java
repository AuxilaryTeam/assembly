package com.bankofabyssinia.assembly.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bankofabyssinia.assembly.model.Assembly;

@Repository
public interface AssemblyRepository extends JpaRepository<Assembly, Long> {
    // Add custom query methods if needed
}
