package com.example.cata.user_microservice.repositories;

import com.example.cata.user_microservice.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUsername(String username);

    Optional<Users> findByRole(String role);

}