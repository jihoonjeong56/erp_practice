package com.example.erp.domain.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class DepartmentCreateRequest {
    @NotBlank(message = "부서 코드는 필수입니다.")
    @Size(max = 30, message = "부서코드는 30자 이하여야 합니다.")
    private String deptCode;

    @NotBlank(message = "부서명은 필수 입니다.")
    @Size(max = 100, message = "부서명은 100자 이하여야 함니다.")
    private String deptName;

    private String description;
    private int sortOrder;
    private Long parentId; //없으면 null == 최상위

}
