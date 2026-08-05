package com.example.erp.domain.dashboard;

import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.department.DepartmentRepository;
import com.example.erp.domain.employee.EmployeeRepository;
import com.example.erp.domain.position.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats(){
        DashboardStats stats = new DashboardStats(
                employeeRepository.count(),
                employeeRepository.countByStatus("ACTIVE"),
                employeeRepository.countByStatus("LEAVE"),
                employeeRepository.countByStatus("RESIGNED"),
                departmentRepository.countByUseYn("Y"),
                positionRepository.countByUseYn("Y")

        );
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
