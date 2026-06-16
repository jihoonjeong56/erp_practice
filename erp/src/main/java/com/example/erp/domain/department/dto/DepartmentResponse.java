package com.example.erp.domain.department.dto;

import com.example.erp.domain.department.Department;
import lombok.Getter;

import java.util.List;

@Getter
public class DepartmentResponse {
    private final Long id;
    private final String deptCode;
    private final String deptName;
    private final String description;
    private final int sortOrder;
    private final String useYn;
    private final Long parentId;
    private final String parentName;
    private final List<DepartmentResponse> children;

    public DepartmentResponse(Department dept){
        this.id = dept.getId();
        this.deptCode = dept.getDeptCode();
        this.deptName = dept.getDeptName();
        this.description = dept.getDescription();
        this.sortOrder = dept.getSortOrder();
        this.useYn = dept.getUseYn();
        this.parentId = dept.getParent() != null ? dept.getParent().getId() : null;
        this.parentName = dept.getParent() != null ? dept.getParent().getDeptName() : null;
        this.children = dept.getChildren().stream()
                .map(DepartmentResponse::new)
                .toList();
    }
}
