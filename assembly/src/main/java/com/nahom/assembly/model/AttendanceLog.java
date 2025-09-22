package com.nahom.assembly.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "attendance_log")
public class AttendanceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDateTime timestamp;

    @Column(name = "attendee_count")
    private BigDecimal attendeeCount;

    @Column(name = "total_share")
    private BigDecimal totalShare;

    @Column(name = "attendee_share_count")
    private BigDecimal attendeeShareCount;
    

}
