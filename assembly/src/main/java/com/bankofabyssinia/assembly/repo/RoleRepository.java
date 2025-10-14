package com.bankofabyssinia.assembly.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankofabyssinia.assembly.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
