package com.bankofabyssinia.assembly_vote_service.Service;

import com.bankofabyssinia.assembly_vote_service.Entity.Role;
import com.bankofabyssinia.assembly_vote_service.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
