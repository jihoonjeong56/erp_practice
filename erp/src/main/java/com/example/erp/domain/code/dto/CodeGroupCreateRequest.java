package com.example.erp.domain.code.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CodeGroupCreateRequest {
    @NotBlank(message = "그룹 코드는 필수입니다.")
    @Size(max = 30, message = "크룹 코드는 30자 이하여야 합니다.")
    private String groupCode;

    @NotBlank(message = "그룹명은 필수입니다.")
    @Size(max = 100, message = "그룹명은 10자 이하여야 합니다.")
    private String groupName;

    private String description;
}
