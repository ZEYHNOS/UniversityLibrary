package com.library.universitylibrary.repository;

import com.library.universitylibrary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUserId(String userId);

    Optional<User> findByUserId(String userId);
}
