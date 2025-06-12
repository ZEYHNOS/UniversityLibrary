package com.library.universitylibrary.service;

import com.library.universitylibrary.dto.user.SigninRequestDto;
import com.library.universitylibrary.dto.user.SignupRequestDto;
import com.library.universitylibrary.dto.user.UserListResponseDto;
import com.library.universitylibrary.entity.User;
import com.library.universitylibrary.jwt.JwtUtil;
import com.library.universitylibrary.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
    
    // 회원 리스트
    public List<UserListResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                // 관리자계정은 제외하는 필터링
                .filter(user -> !"ADMIN".equalsIgnoreCase(user.getUserRole()))
                .filter(user -> !"DELETED".equalsIgnoreCase(user.getUserStatus()))
                .map(user -> new UserListResponseDto(
                        user.getUserId(),
                        user.getUserName(),
                        user.getUserDp(),
                        user.getUserPhone(),
                        user.getUserStatus()
                ))
                .collect(Collectors.toList());
    }
    
    // 회원 비활성화
    @Transactional
    public void deactivateUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다: " + userId));

        user.setUserStatus("INACTIVE");
        // 변경 감지로 update 자동 수행됨
    }
    
    // 회원 활성화
    @Transactional
    public void activateUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다: " + userId));

        user.setUserStatus("ACTIVE");
    }

    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다: " + userId));
        user.setUserStatus("DELETED");
    }

}