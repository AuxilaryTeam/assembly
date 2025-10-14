package com.bankofabyssinia.assembly.repo;


import com.bankofabyssinia.assembly.model.ElectionStatus;
import com.bankofabyssinia.assembly.model.Position;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {

    List<Position> findByStatus(ElectionStatus status);

}