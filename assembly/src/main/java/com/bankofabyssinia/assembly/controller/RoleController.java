package com.bankofabyssinia.assembly.controller;

import com.bankofabyssinia.assembly.model.Role;
import com.bankofabyssinia.assembly.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")

public class RoleController {

    @Autowired
    private RoleService roleService;

    // create role
    @PostMapping("/create")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        roleService.saveRole(role);
        return ResponseEntity.ok("Role created successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

}
