package com.example.erp.domain.department.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class DepartmentUpdateRequest {
    @NotBlank(message = "부서명은 필수 입니다.")
    private String deptName;

    private String description;
    private int sortOrder;
    private String useYn;
    private Long parentId;
}
