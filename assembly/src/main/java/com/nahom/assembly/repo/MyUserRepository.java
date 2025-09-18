package com.nahom.assembly.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nahom.assembly.model.MyUser;

import java.util.Optional;


public interface MyUserRepository extends JpaRepository<MyUser, Long>{

Optional<MyUser> findByUsername(String username);

}
