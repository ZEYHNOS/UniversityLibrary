package com.library.universitylibrary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String userId;

    @Column(nullable = false)
    private String userPw;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String userDp;

    @Column(nullable = false)
    private String userPhone;

    @Column(nullable = false, columnDefinition = "VARCHAR(10) DEFAULT 'USER'")
    private String userRole;

    @Column(nullable = false, columnDefinition = "VARCHAR(10) DEFAULT 'ACTIVE'")
    private String userStatus;
}
