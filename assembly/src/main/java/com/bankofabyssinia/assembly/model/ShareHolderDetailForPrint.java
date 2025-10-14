package com.bankofabyssinia.assembly.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sherholderdetailforprint", schema = "dbo", catalog = "assembly")
@Data
@NoArgsConstructor
public class ShareHolderDetailForPrint {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "attendance")
    private Boolean attendance;

    @Column(name = "devidend")
    private Double devidend;

    @Column(name = "fiscalyear")
    private String fiscalyear;

    @Column(name = "nameamh")
    private String nameamh;

    @Column(name = "nameeng")
    private String nameeng;

    @Column(name = "paidcapital")
    private Double paidcapital;

    @Column(name = "phone")
    private String phone;

    @Column(name = "shareholderid")
    private String shareholderid;

    @Column(name = "sharesubsription")
    private Double sharesubsription;

    @Column(name = "totalcapital")
    private Double totalcapital;

    @Column(name = "votingsubscription")
    private Double votingsubscription;
}
