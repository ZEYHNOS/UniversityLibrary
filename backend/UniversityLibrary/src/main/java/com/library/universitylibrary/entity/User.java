package com.library.universitylibrary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String userId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String userDp;

    @Column(nullable = false)
    private String userPhone;

    @Column(nullable = false)
    private String userRole;

    @Column(nullable = false)
    private String userStatus;
}
