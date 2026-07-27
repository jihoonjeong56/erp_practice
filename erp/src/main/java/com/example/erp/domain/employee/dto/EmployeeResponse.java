package com.example.erp.domain.employee.dto;

import com.example.erp.domain.department.Department;
import com.example.erp.domain.employee.Employee;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EmployeeResponse {
    private final Long id;
    private final String empNo;
    private final String empName;
    private final String email;
    private final String phone;
    private final Long deptId;
    private final String deptName;
    private final Long positionId;
    private final String positionName;
    private final LocalDateTime hireDate;
    private final LocalDateTime leaveDate;
    private final String status;

    public EmployeeResponse(Employee employee) {
        this.id = employee.getId();
        this.empNo = employee.getEmpNo();
        this.empName = employee.getEmpName();
        this.email = employee.getEmail();
        this.phone = employee.getPhone();
        this.deptId = employee.getDepartment().getId();
        this.deptName = employee.getDepartment().getDeptName();
        this.positionId = employee.getPosition().getId();
        this.positionName = employee.getPosition().getPosName();
        this.hireDate = employee.getHireDate();
        this.leaveDate = employee.getLeaveDate();
        this.status = employee.getStatus();
    }
}
