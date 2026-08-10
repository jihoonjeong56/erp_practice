package com.example.erp.domain.code.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommonCodeUpdateRequest {
    @NotBlank(message = "코드명은 필수입니다.")
    private String codeName;

    private int sortOrder;

    @NotBlank(message = "아용여부는 필수입니다.")
    private String useYn;
}
