package com.library.universitylibrary.service;

import com.library.universitylibrary.dto.user.SigninRequestDto;
import com.library.universitylibrary.dto.user.SignupRequestDto;
import com.library.universitylibrary.entity.User;
import com.library.universitylibrary.jwt.JwtUtil;
import com.library.universitylibrary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입 (passwordencorder 적용)
    public void signup(SignupRequestDto dto) {
        if (userRepository.existsByUserId(dto.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        String encodedPw = passwordEncoder.encode(dto.getUserPw());

        User user = User.builder()
                .userId(dto.getUserId())
                .userName(dto.getUserName())
                .userDp(dto.getUserDp())
                .userPhone(dto.getUserPhone())
                .userPw(encodedPw)
                .userRole("USER")
                .userStatus("ACTIVE")
                .build();

        userRepository.save(user);
    }

    // 로그인
    public String login(SigninRequestDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (user == null || !passwordEncoder.matches(dto.getUserPw(), user.getUserPw())) {
            return null;
        }

        // 토큰 발급
        return jwtUtil.createToken(
                user.getUserId(),
                user.getUserName(),
                user.getUserRole()
        );
    }
}