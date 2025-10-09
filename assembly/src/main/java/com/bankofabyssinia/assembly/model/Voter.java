package com.bankofabyssinia.assembly.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sherholderdetail", schema = "dbo", catalog = "assembly")
@Data
@NoArgsConstructor
public class Voter {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "attendance")
    private int attendance;

    @Column(name = "devidend")
    private Double devidend;

        @Column(name = "fiscalyear", length = 20)
        private String fiscalyear;

        @Column(name = "nameamh", length = 100)
        private String nameamh;

        @Column(name = "nameeng", length = 100)
        private String nameeng;

        @Column(name = "paidcapital")
        private Double paidcapital;

        @Column(name = "phone", length = 20)
        private String phone;

        @Column(name = "shareholderid", length = 50)
        private String shareholderid;

        @Column(name = "sharesubsription")
        private Double sharesubsription;

        @Column(name = "totalcapital")
        private Double totalcapital;

        @Column(name = "votingsubscription")
        private Double votingsubscription;
}
