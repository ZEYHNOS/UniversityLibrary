package com.library.universitylibrary.controller;

import com.library.universitylibrary.dto.user.SigninRequestDto;
import com.library.universitylibrary.dto.user.SignupRequestDto;
import com.library.universitylibrary.dto.user.UserListResponseDto;
import com.library.universitylibrary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    // 회원 추가
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("회원가입 성공!");
    }

    // 로그인하기
    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signin(@RequestBody SigninRequestDto dto) {
        String token = userService.login(dto);

        if (token != null) {
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(null);
        }
    }

    // 회원 리스트
    @GetMapping("/list")
    public List<UserListResponseDto> getUserList() {
        return userService.getAllUsers();
    }

    // 회원 비활성화
    @PutMapping("/inactive/{userId}")
    public ResponseEntity<String> deactivateUser(@PathVariable String userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok("사용자 비활성화 완료: " + userId);
    }

    // 회원 활성화
    @PutMapping("/active/{userId}")
    public ResponseEntity<String> activateUser(@PathVariable String userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok("사용자 활성화 완료: " + userId);
    }

    @PutMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("사용자 삭제 완료: " + userId);
    }
}