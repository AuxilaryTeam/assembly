package com.nahom.assembly.repo;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nahom.assembly.model.Sherholderdetail;
import java.util.List;
import java.math.BigDecimal;



public interface ShareholderRepo extends JpaRepository<Sherholderdetail, Long>{

   List<Sherholderdetail> findByPhoneStartsWith(String phone);
   List<Sherholderdetail> findByNameengStartsWith(String nameeng);
   List<Sherholderdetail> findByAttendanceAndSharesubsriptionGreaterThan(int attendance, int minimumSubscription);
   List<Sherholderdetail> findByShareholderid(String shareid);
 @Query("SELECT COUNT(a) FROM Sherholderdetail a WHERE a.attendance = 1")
    long countPresent();

 @Query("SELECT COUNT(a) FROM Sherholderdetail a WHERE a.attendance = 0")
    long countAbsent();

    @Query("SELECT SUM(a.votingsubscription) FROM Sherholderdetail a WHERE a.attendance = 1")
    BigDecimal sumvotingsubscriptionForPresent();  

    @Query("SELECT SUM(a.sharesubsription) FROM Sherholderdetail a")
    BigDecimal sumShareSubscription();

    }
    