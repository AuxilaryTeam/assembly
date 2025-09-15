package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {
}
