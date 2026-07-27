package com.example.erp.domain.employee.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EmployeeUpdateRequest {

    @NotBlank(message = "직원명은 필수입니다.")
    private String empName;

    @NotBlank(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    private String phone;

    @NotBlank(message = "부서는 필수입니다.")
    private Long depId;

    @NotBlank(message = "직급은 필수입니다")
    private Long positionId;

    @NotBlank(message = "상태는 필수입니다.")
    private String status;

    private LocalDateTime leaveDate;
}
