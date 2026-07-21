package com.example.erp.domain.department;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByDeptCode(String deptCode);

    Optional<Department> findByDeptCode(String deptCode);

    List<Department> findByParentIsNullOrderBySortOrderAsc(); // 최상위 부서 (parent == null)
    List<Department> findByParentIdOrderBySortOrderAsc(Long parentId);
    List<Department> findByUseYnOrderBySortOrderAsc(String useYn);

    @Query("SELECT d From Department d LEFT JOIN FETCH d.children WHERE d.parent IS NULL ORDER BY d.sortOrder")
    List<Department> findAllTree();

    List<Department> findAllByOrderBySortOrderAsc();

}
