package com.example.erp.domain.employee;


import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.employee.dto.EmployeeCreateRequest;
import com.example.erp.domain.employee.dto.EmployeeResponse;
import com.example.erp.domain.employee.dto.EmployeeUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> create(@Valid @RequestBody EmployeeCreateRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(employeeService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAll(){
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getEmployee(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> update(@PathVariable Long id, @Valid @RequestBody EmployeeUpdateRequest request){
        employeeService.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
