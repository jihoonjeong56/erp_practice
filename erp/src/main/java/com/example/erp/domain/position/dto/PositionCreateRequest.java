package com.example.erp.domain.position.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PositionCreateRequest {

    @NotBlank(message = "직급코드는 필수입니다.")
    private String posCode;

    @NotBlank(message = "직급명은 필수입니다.")
    private String posName;

    @NotBlank(message = "직급레벨은 필수입니다.")
    private int level;
}
