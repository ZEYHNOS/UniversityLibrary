package com.library.universitylibrary.controller;

import com.library.universitylibrary.dto.SigninRequestDto;
import com.library.universitylibrary.dto.SignupRequestDto;
import com.library.universitylibrary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    // 회원가입
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

}