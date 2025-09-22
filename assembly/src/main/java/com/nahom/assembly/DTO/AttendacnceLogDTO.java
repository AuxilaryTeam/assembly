package com.nahom.assembly.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AttendacnceLogDTO {

    private LocalDateTime timestamp;
    private BigDecimal attendeeCount;
    private BigDecimal totalShare;
    private BigDecimal attendeeShareCount;
    
}
