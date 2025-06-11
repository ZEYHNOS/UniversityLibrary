package com.library.universitylibrary.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserListResponseDto {
    private String userId;
    private String userName;
    private String userDp;
    private String userPhone;
    private String userStatus;
}