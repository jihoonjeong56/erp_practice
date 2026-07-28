package com.example.erp.domain.employee;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.department.Department;
import com.example.erp.domain.department.DepartmentRepository;
import com.example.erp.domain.employee.dto.EmployeeCreateRequest;
import com.example.erp.domain.employee.dto.EmployeeResponse;
import com.example.erp.domain.employee.dto.EmployeeUpdateRequest;
import com.example.erp.domain.position.Position;
import com.example.erp.domain.position.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @Transactional
    public Long create(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmpNo(request.getEmpNo())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMP_NO);
        }
        if (request.getEmail() != null && employeeRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMPLOYEE_EMAIL);
        }

        Department department = departmentRepository.findById(request.getDeptId())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));

        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.POSITION_NOT_FOUND));

        return employeeRepository.save(Employee.builder()
                .empNo(request.getEmpNo())
                .empName(request.getEmpName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(department)
                .position(position)
                .hireDate(request.getHireDate())
                .status("ACTIVE")
                .build()

        ).getId();
    }

    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAllWithDetails()
                .stream()
                .map(EmployeeResponse::new)
                .toList();
    }

    public EmployeeResponse getEmployee(Long id) {
        return new EmployeeResponse(employeeRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND)));
    }

    @Transactional
    public void update(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));

        Department department = departmentRepository.findById(request.getDepId())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));

        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.POSITION_NOT_FOUND));

        employee.update(
                request.getEmpName(),
                request.getEmail(),
                request.getPhone(),
                department,
                position,
                request.getStatus(),
                request.getLeaveDate()
        );
    }

    @Transactional
    public void delete(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() ->  new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));
        employeeRepository.delete(employee);
    }

}
