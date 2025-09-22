package com.nahom.assembly.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nahom.assembly.model.AttendanceLog;

public interface AttendanceLogRepository extends JpaRepository<AttendanceLog,Long> {
    List<AttendanceLog> findAllByOrderByTimestampDesc();

}
