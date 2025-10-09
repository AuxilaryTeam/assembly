package com.bankofabyssinia.assembly.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "sherholderdetail", schema = "dbo", catalog = "assembly")
public class Sherholderdetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private BigDecimal devidend;

        
        private String nameamh;
        
        private String nameeng;
        private BigDecimal paidcapital;
        
        private String phone;
        private String shareholderid;
        private BigDecimal totalcapital;
        private BigDecimal sharesubsription;
        private int attendance;
        
        private LocalDateTime attendanceTimestamp;

        private String fiscalyear;
        private BigDecimal votingsubscription;
 }
