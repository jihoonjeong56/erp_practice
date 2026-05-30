package com.example.erp.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignUpRequest {
    @NotBlank(message = "아이디는 필수 입니다.")
    @Size(min = 4, max = 20, message = "아이디는 4~20자 사이어야 합니다")
    private String username;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수 입니다.")
    @Email(message = "이메잉 형식이 올바르지 않습니다")
    private String email;
}
