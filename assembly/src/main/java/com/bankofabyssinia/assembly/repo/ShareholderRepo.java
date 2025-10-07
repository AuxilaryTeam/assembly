package com.bankofabyssinia.assembly.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bankofabyssinia.assembly.model.Sherholderdetail;

import java.util.List;
import java.math.BigDecimal;

public interface ShareholderRepo extends JpaRepository<Sherholderdetail, Long> {

    // Search methods
    List<Sherholderdetail> findByPhoneStartsWith(String phone);
    List<Sherholderdetail> findByNameengStartsWith(String nameeng);
    List<Sherholderdetail> findByShareholderidStartsWith(String shareid);
    // smart search 
     @Query("SELECT s FROM Sherholderdetail s WHERE " +
         "CAST(s.shareholderid AS string) LIKE CONCAT(:query, '%') OR " +
         "(:isNumeric = true AND s.phone LIKE CONCAT(:query, '%')) OR " +
         "(:isString = true AND s.nameeng LIKE CONCAT(:query, '%'))")
     List<Sherholderdetail> searchSmart(@Param("query") String query, 
                                                    @Param("isNumeric") boolean isNumeric,
                                                    @Param("isString") boolean isString);



    // Attendance queries
    List<Sherholderdetail> findByAttendanceAndSharesubsriptionGreaterThan(int attendance, int minimumSubscription);

    @Query("SELECT COUNT(a) FROM Sherholderdetail a WHERE a.attendance = 1")
    long countPresent();

    @Query("SELECT COUNT(a) FROM Sherholderdetail a WHERE a.attendance = 0")
    long countAbsent();

    // Sum queries
    @Query("SELECT SUM(a.votingsubscription) FROM Sherholderdetail a WHERE a.attendance = 1")
    BigDecimal sumvotingsubscriptionForPresent();

    @Query("SELECT SUM(a.sharesubsription) FROM Sherholderdetail a")
    BigDecimal sumShareSubscription();
}
