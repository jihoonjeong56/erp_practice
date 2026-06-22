package com.example.erp.domain.department;

import com.example.erp.common.response.ApiResponse;
import com.example.erp.domain.department.dto.DepartmentCreateRequest;
import com.example.erp.domain.department.dto.DepartmentResponse;
import com.example.erp.domain.department.dto.DepartmentUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> create(@Valid @RequestBody DepartmentCreateRequest request){
        Long id = departmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentUpdateRequest request
            ){
        departmentService.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){
        departmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartment(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.ok(departmentService.getDepartment(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments(){
        return ResponseEntity.ok(ApiResponse.ok(departmentService.getAllDepartments()));
    }

    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartmentTree(){
        return ResponseEntity.ok(ApiResponse.ok(departmentService.getDepartmentTree()));
    }
    
}

