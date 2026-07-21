package com.example.erp.domain.department;

import com.example.erp.common.exception.BusinessException;
import com.example.erp.common.response.ErrorCode;
import com.example.erp.domain.department.dto.DepartmentCreateRequest;
import com.example.erp.domain.department.dto.DepartmentResponse;
import com.example.erp.domain.department.dto.DepartmentUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService  {
    private final DepartmentRepository departmentRepository;

    @Transactional
    public Long create(DepartmentCreateRequest request){
        if(departmentRepository.existsByDeptCode(request.getDeptCode())){
            throw new BusinessException(ErrorCode.DUPLICATE_DEPT_CODE);
        }
        Department parent = null;
        if(request.getParentId() != null){
            parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));
        }
        Department department = Department.builder()
                .deptCode(request.getDeptCode())
                .deptName(request.getDeptName())
                .description(request.getDescription())
                .sortOrder(request.getSortOrder())
                .useYn("Y")
                .parent(parent)
                .build();
        return departmentRepository.save(department).getId();
    }

    @Transactional
    public void update(Long id, DepartmentUpdateRequest request){
        Department department = departmentRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));

        Department parent = null;
        if(request.getParentId() != null){
            if(request.getParentId().equals(id)){
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));
        }
        department.update(
                request.getDeptName(),
                request.getDescription(),
                request.getSortOrder(),
                request.getUseYn(),
                parent
        );
    }
    @Transactional
    public void delete(Long id){
        Department department = departmentRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));

        if(!department.getChildren().isEmpty()){
            throw new BusinessException(ErrorCode.CANNOT_DELETE_DEPARTMENT);
        }
        departmentRepository.delete(department);
    }

    public DepartmentResponse getDepartment(Long id){
        Department department = departmentRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUNT));
        return new DepartmentResponse(department);
    }

    public List<DepartmentResponse> getAllDepartments(){
        return departmentRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(DepartmentResponse::new)
                .toList();
    }

    public List<DepartmentResponse> getDepartmentTree(){
        return departmentRepository.findByParentIsNullOrderBySortOrderAsc()
                .stream()
                .map(DepartmentResponse::new)
                .toList();
    }

}
