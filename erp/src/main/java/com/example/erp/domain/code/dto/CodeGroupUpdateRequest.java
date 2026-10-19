package com.example.erp.domain.code.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CodeGroupUpdateRequest {

    @NotBlank(message = "그룹명은 필수입니다.")
    private String groupName;

    private String description;
}
