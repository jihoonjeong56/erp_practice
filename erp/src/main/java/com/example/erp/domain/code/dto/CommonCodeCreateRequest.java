package com.example.erp.domain.code.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommonCodeCreateRequest {
    @NotBlank(message = "코드는 필수입니다.")
    private String code;

    @NotBlank(message = "코드명은 필수입니다.")
    private String codeName;

    private int sortOrder;
}
