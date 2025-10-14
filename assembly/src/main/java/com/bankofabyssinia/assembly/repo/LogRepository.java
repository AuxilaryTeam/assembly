package com.bankofabyssinia.assembly.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.Log;

public interface LogRepository extends JpaRepository<Log, Long> {
}
