package com.library.universitylibrary.dto.user;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequestDto {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("user_pw")
    private String userPw;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("user_dp")
    private String userDp;

    @JsonProperty("user_phone")
    private String userPhone;
}