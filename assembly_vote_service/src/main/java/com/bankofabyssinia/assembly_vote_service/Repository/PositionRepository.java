package com.bankofabyssinia.assembly_vote_service.Repository;


import com.bankofabyssinia.assembly_vote_service.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {
}

