package com.example.erp.domain.position.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PositionUpdateRequest {
    @NotBlank(message = "직급명은 필수입니다.")
    private String posName;

    @NotBlank(message = "직급레벨은 필수입니다.")
    private int level;

    @NotBlank(message = "사용여부는 필수 입니다.")
    private String useYn;
}
