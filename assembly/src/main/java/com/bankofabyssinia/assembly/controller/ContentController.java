package com.bankofabyssinia.assembly.controller;


import java.math.BigDecimal;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankofabyssinia.assembly.config.MyUserDetailService;
import com.bankofabyssinia.assembly.model.AttendanceLog;
import com.bankofabyssinia.assembly.model.Sherholderdetail;
import com.bankofabyssinia.assembly.repo.AttendanceLogRepository;
import com.bankofabyssinia.assembly.repo.ShareholderRepo;
// import com.bankofabyssinia.assembly.webtoken.JwtService;
import com.bankofabyssinia.assembly.webtoken.LoginForm;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestParam;





 @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "Authorization")
@RestController
@RequestMapping("/api")
public class ContentController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private com.bankofabyssinia.assembly.webtoken.JwtService jwtService;
    @Autowired
    private MyUserDetailService myUserDetailService;

    @Autowired
    private ShareholderRepo sharerepo;

    @Autowired
    private AttendanceLogRepository attendanceLogRepository;
       

    @GetMapping("/home")
    public String handleWelcome(HttpServletRequest request) {
        return "Welcome to home!";
    }

    @GetMapping("/admin/home")
    public String handleAdminHome() {
        return "Welcome to ADMIN home!";
    }

    @GetMapping("/admin/phone/{phone}")
    public List<Sherholderdetail> searchphone(@PathVariable String phone) {
        return sharerepo.findByPhoneStartsWith(phone);
    }

    @GetMapping("/admin/name/{name}")
    public List<Sherholderdetail> searchname(@PathVariable String name) {
        return sharerepo.findByNameengStartsWith(name);
    }

    @GetMapping("/admin/shareid/{shareid}")
    public List<Sherholderdetail> searchshareholderId(@PathVariable String shareid) {
        return sharerepo.findByShareholderidStartsWith(shareid);
    }
    @GetMapping("/admin/search/{query}")
    public List<Sherholderdetail> searchSmart(@PathVariable String query) {
        boolean isNumeric = query.chars().allMatch(Character::isDigit);
        boolean isString = !isNumeric;
    
        // normalize query for phone starting with 09
        String normalizedQuery = query;
        if (isNumeric && query.startsWith("09")) {
            normalizedQuery = query.substring(1); // remove leading 0
        }
    
        return sharerepo.searchSmart(normalizedQuery, isNumeric, isString);
    }
    

// @GetMapping("/admin/getperson/{id}")
// public String getuserdata(@PathVariable Long id) {
    
//     return sharerepo.findAllById(id);
// }

@GetMapping("/admin/person/{id}")
public Optional<Sherholderdetail> getSherholderdetail( @PathVariable Long id){

    
    return sharerepo.findById(id); 
}


    @PostMapping("/admin/attendance/{id}")
    public  ResponseEntity<?> updateAttendance( @PathVariable Long id) {
        //TODO: process POST request
       Optional<Sherholderdetail> temp= sharerepo.findById(id);

       if (temp.isPresent() && temp.get().getVotingsubscription().compareTo(BigDecimal.ZERO) == 0 && temp.get().getTotalcapital().compareTo(BigDecimal.ZERO) == 0) {
        // If the entity is not found, return a 404 response
        return ResponseEntity.status(400).body(
            Map.of(
                "error", "Invalid shareholder data"
            )
        );
       }
        
        if (temp.isPresent()) {
        // Update the attendance value, for example, to mark attendance
        Sherholderdetail shareholder = temp.get();
        shareholder.setAttendance(1); // Set attendance to 1 or any desired value


          // Set the timestamp
        shareholder.setAttendanceTimestamp(LocalDateTime.now());

        // Save the updated entity back to the repository
        sharerepo.save(shareholder);

        // Return the updated entity
        return ResponseEntity.ok(shareholder);
    } else {
        // If the entity is not found, return a 404 response
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }


    
    }

    @PostMapping("/admin/attendance0/{id}")
    public  ResponseEntity<Sherholderdetail> updateAttendance0( @PathVariable Long id) {
        //TODO: process POST request
       Optional<Sherholderdetail> temp= sharerepo.findById(id);
        
           if (temp.isPresent()) {
        // Update the attendance value, for example, to mark attendance
        Sherholderdetail shareholder = temp.get();
        shareholder.setAttendance(0); // Set attendance to 1 or any desired value

          
            // Set the timestamp
        shareholder.setAttendanceTimestamp(LocalDateTime.now());


        // Save the updated entity back to the repository
        sharerepo.save(shareholder);

        // Return the updated entity
        return ResponseEntity.ok(shareholder);
    } else {
        // If the entity is not found, return a 404 response
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }


        
    }
    







    @PostMapping("/authenticate")
    public String authenticateAndGetToken(@RequestBody com.bankofabyssinia.assembly.webtoken.LoginForm loginForm) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginForm.username(), loginForm.password()
            )
        );
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(myUserDetailService.loadUserByUsername(loginForm.username()));
        } else {
            throw new UsernameNotFoundException("Invalid credentials");
        }
    }


        // Endpoint for shareholders with attendance = 1
        @GetMapping("/admin/present")
        public List<Sherholderdetail> findByAttendanceAndSubscriptionpresent() {
            return sharerepo.findByAttendanceAndSharesubsriptionGreaterThan(1,0);
        }

        // Endpoint for shareholders with attendance = 0
        @GetMapping("/admin/absent")
        public List<Sherholderdetail> findByAttendanceAndSubscription() {
            return sharerepo.findByAttendanceAndSharesubsriptionGreaterThan(0,0);
        }
        @GetMapping("/admin/countp")
        public Long countpresaent() {
            return sharerepo.countPresent();
        }
        @GetMapping("/admin/counta")
        public Long countabsent() {
            return sharerepo.countAbsent();
        }
        @GetMapping("/admin/sumvoting")
        public BigDecimal sumvoting() {
            return sharerepo.sumvotingsubscriptionForPresent();
        }

        @GetMapping("/admin/sumsub")
        public BigDecimal sumsub() {
            return sharerepo.sumShareSubscription();
        }

        @PostMapping("/admin/printlog")
        public ResponseEntity<AttendanceLog> logPrint(@RequestBody AttendanceLog request) {
            // ensure timestamp is set if missing
            if (request.getTimestamp() == null) {
                request.setTimestamp(java.time.LocalDateTime.now());
            }

            AttendanceLog savedLog = attendanceLogRepository.save(request);

            return ResponseEntity.ok(savedLog);
        }

        @GetMapping("/admin/printlog")
        public ResponseEntity<List<AttendanceLog>> getPrintLog() {
            List<AttendanceLog> logs = attendanceLogRepository.findAllByOrderByTimestampDesc();
            return ResponseEntity.ok(logs);
        }

        

        


}

