package com.bankofabyssinia.assembly.repo;



import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bankofabyssinia.assembly.model.ShareHolderDetailForPrint;

public interface ShareHolderDetailForPrintRepository extends JpaRepository<ShareHolderDetailForPrint, Long> {
    List<ShareHolderDetailForPrint> findByPhoneStartsWith(String phone);
   List<ShareHolderDetailForPrint> findByNameengStartsWith(String nameeng);
   List<ShareHolderDetailForPrint> findByShareholderid(String shareid);
 

}