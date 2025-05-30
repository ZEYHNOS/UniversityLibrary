package com.library.universitylibrary.repository;

import com.library.universitylibrary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
