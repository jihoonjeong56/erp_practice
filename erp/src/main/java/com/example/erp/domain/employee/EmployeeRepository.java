package com.example.erp.domain.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmpNo(String empNo);
    boolean existsByEmail(String email);

    // N+1 방지 fetch join
    @Query("SELECT e FROM Employee e JOIN FETCH e.department JOIN FETCH e.position")
    List<Employee> findAllWithDetails();

    // 부서별 직원 조회
    @Query("SELECT e FROM Employee e JOIN FETCH e.department JOIN FETCH e.position " +
            "WHERE e.department.id = :deptId")
    List<Employee> findByDeptId(@Param("deptId") Long deptId);

    @Query("SELECT e FROM Employee e JOIN FETCH e.department JOIN FETCH e.position " +
            "WHERE e.status = :status")
    List<Employee> findByStatus(@Param("status") String status);

    long countByStatus(String status);

}
