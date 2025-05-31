package com.library.universitylibrary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SigninRequestDto {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("user_pw")
    private String userPw;

}