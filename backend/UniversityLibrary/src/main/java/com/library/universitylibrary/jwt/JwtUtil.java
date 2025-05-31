package com.library.universitylibrary.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.security.Key;

@Component
public class JwtUtil {

    private final Key key = Keys.hmacShaKeyFor("my-secret-key-1234567890-my-secret-key".getBytes());  // 256비트 이상

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2시간

    // 토큰 생성
    public String createToken(String userId, String userName, String userRole) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("userName", userName)
                .claim("userRole", userRole)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 검증 (파싱)
    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody(); // Claims: 유저정보 + 유효시간 포함된 객체
    }
}
