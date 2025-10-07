package com.bankofabyssinia.assembly.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class Sherholderdetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private BigDecimal devidend;

    @Column(name = "nameamh", columnDefinition = "nvarchar(255)")
    private String nameamh;
    private String nameeng;
    private BigDecimal paidcapital;
    private String phone;
    private String shareholderid;
    private BigDecimal totalcapital;
    private BigDecimal sharesubsription;
    private int attendance;
    @Column(name = "attendance_timestamp", columnDefinition = "datetime2(6)")
    private LocalDateTime attendanceTimestamp;
    private String fiscalyear;
    private BigDecimal votingsubscription;
 }
