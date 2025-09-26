package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.ShareHolderDetailForPrint;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ShareHolderDetailForPrintRepository extends JpaRepository<ShareHolderDetailForPrint, Long> {
    List<ShareHolderDetailForPrint> findByPhoneStartsWith(String phone);
   List<ShareHolderDetailForPrint> findByNameengStartsWith(String nameeng);
   List<ShareHolderDetailForPrint> findByShareholderid(String shareid);
 

}