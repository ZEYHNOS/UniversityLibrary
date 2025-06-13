package com.library.universitylibrary.config;

import com.library.universitylibrary.entity.User;
import com.library.universitylibrary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner insertAdminUser() {
        return args -> {
            if (!userRepository.existsById("admin")) {
                userRepository.save(User.builder()
                        .userId("admin")
                        .userPw(passwordEncoder.encode("admin"))
                        .userName("관리자")
                        .userDp("관리자")
                        .userPhone("01045245468")
                        .userRole("ADMIN")
                        .userStatus("active")
                        .build());
            }
        };
    }
}
