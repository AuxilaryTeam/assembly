package com.bankofabyssinia.assembly_vote_service.Controller;

import java.net.http.HttpRequest;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankofabyssinia.assembly_vote_service.Service.AssemblyService;
import com.bankofabyssinia.assembly_vote_service.Service.AuthService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.servlet.http.HttpServletRequest;

import com.bankofabyssinia.assembly_vote_service.Entity.Assembly;
import com.bankofabyssinia.assembly_vote_service.Entity.User;

@RestController
@RequestMapping("/assemblies")
public class AssemblyController {
    
    @Autowired
    private AssemblyService assemblyService;

    @Autowired
    private AuthService authService;

   @PostMapping("/create")
   public ResponseEntity<?> createAssembly(@RequestBody Assembly assembly, HttpServletRequest request) {
        String token = authService.getToken(request);
        User user  = authService.getUserFromToken(token);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of(
                    "error", "Missing authentication token",
                    "message", "You must provide a valid token to create an assembly."
                )
            );
        }
        if (user == null || !user.getRole().getName().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of(
                    "error", "Forbidden",
                    "message", "You do not have permission to create an assembly."
                )
            );
        }
        try {
            Assembly createdAssembly = assemblyService.createAssembly(assembly);
            return new ResponseEntity<>(createdAssembly, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                    "error", "Assembly creation failed",
                    "message", e.getMessage()
                )
            );
        }
   }

   @GetMapping("/all")
    public ResponseEntity<List<Assembly>> getAllAssemblies() {
         List<Assembly> assemblies = assemblyService.getAllAssemblies();
         return ResponseEntity.ok(assemblies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assembly> getAssemblyById(@PathVariable Long id) {
        return assemblyService.getAssemblyById(id)
                .map(assembly -> ResponseEntity.ok(assembly))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Assembly> updateAssembly(@PathVariable Long id, @RequestBody Assembly assembly) {
        return assemblyService.updateAssembly(id, assembly)
                .map(updatedAssembly -> ResponseEntity.ok(updatedAssembly))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAssembly(@PathVariable Long id) {
        if (assemblyService.deleteAssembly(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
