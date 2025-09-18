package com.bankofabyssinia.assembly_vote_service.Repository;


import com.bankofabyssinia.assembly_vote_service.Entity.ElectionStatus;
import com.bankofabyssinia.assembly_vote_service.Entity.Position;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {

    List<Position> findByStatus(ElectionStatus open);
}

