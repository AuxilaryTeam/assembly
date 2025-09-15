package com.bankofabyssinia.assembly_vote_service.Repository;

import com.bankofabyssinia.assembly_vote_service.Entity.User;
import com.bankofabyssinia.assembly_vote_service.Entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByEmailIgnoreCase(String email);
}


