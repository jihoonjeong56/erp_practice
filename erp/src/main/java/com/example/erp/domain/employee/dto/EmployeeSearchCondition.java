package com.example.erp.domain.employee.dto;

public record EmployeeSearchCondition(
        String keyword,
        Long deptId,
        Long positionId,
        String status
){}
