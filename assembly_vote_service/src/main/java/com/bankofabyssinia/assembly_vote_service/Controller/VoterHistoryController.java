package com.bankofabyssinia.assembly_vote_service.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankofabyssinia.assembly_vote_service.Entity.User;
import com.bankofabyssinia.assembly_vote_service.Exception.PositionNotFoundException;
import com.bankofabyssinia.assembly_vote_service.Service.AuthService;
import com.bankofabyssinia.assembly_vote_service.Service.VoterService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/api/voter-history")
public class VoterHistoryController {

    @Autowired
    private VoterService voterService;
    
    @Autowired
    private AuthService authService;

    // list of VOTERS AND EACH VOTED FOR WHICH CANDIDATE FOR EACH POSITION by position id
    
@GetMapping("/by-position/{positionId}/paginated")
public ResponseEntity<?> getVoterHistoryByPositionPaginated(
    @PathParam("positionId") Long positionId,
    @PathParam("page") Integer page,
    @PathParam("size") Integer size,
    HttpServletRequest requestHeader) {
    String token = authService.getToken(requestHeader);
    User user = authService.getUserFromToken(token);

    try {
    if (user.getRole() != null && !user.getRole().getName().equals("ADMIN")) {
        return ResponseEntity.status(403).body(
        Map.of(
            "error", "Forbidden",
            "message", "You do not have permission to access this resource"
        )
        );
    }

    int pageNumber = (page != null && page > 0) ? page : 1;
    int pageSize = (size != null && size > 0) ? size : 10;

    Map<String, Object> paginatedResult = voterService.getVoterHistoryByPositionPaginated(positionId, user, pageNumber, pageSize);
    return ResponseEntity.ok(paginatedResult);
    } catch (Exception e) {
    return ResponseEntity.status(500).body(
        Map.of(
        "error", e.getMessage(),
        "message", "Could not retrieve voter history"
        )
    );
    }
}

    @GetMapping("/by-position")
    public ResponseEntity<?> getVoterHistoryByPosition(@PathParam("positionId") Long positionId, HttpServletRequest requestHeader) {
        String token = authService.getToken(requestHeader);
        User user = authService.getUserFromToken(token);
        
        try {

           if(user.getRole() != null && !user.getRole().getName().equals("ADMIN")) {
                return ResponseEntity.status(403).body(
                    Map.of(
                        "error", "Forbidden",
                        "message", "You do not have permission to access this resource"
                    )
                );
           } 

            List<?> voterHistories = voterService.getVoterHistoryByPosition(positionId, user);
            return ResponseEntity.ok(voterHistories);
        } catch (PositionNotFoundException e) { 
            return ResponseEntity.status(404).body(
                    Map.of(
                            "error", e.getMessage(),
                            "message", "Position not found"
                    )
            );
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "error", e.getMessage(),
                            "message", "Could not retrieve voter history"
                    )
            );
        }
    }

}
