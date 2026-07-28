package com.example.erp.domain.employee;

import com.example.erp.common.utils.BaseTimeEntity;
import com.example.erp.domain.department.Department;
import com.example.erp.domain.position.Position;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "employee")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Employee extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String empNo;

    @Column(nullable = false, length = 50)
    private String empName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @Column(nullable = false)
    private LocalDateTime hireDate; // 입사일

    @Column
    private LocalDateTime leaveDate; //퇴사일

    @Column(nullable = false, length = 20)
    private String status;

    @Builder
    public Employee(String empNo, String empName, String email, String phone, Department department, Position position, LocalDateTime hireDate, String status) {
        this.empNo = empNo;
        this.empName = empName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.position = position;
        this.hireDate = hireDate;
        this.status = status != null ? status: "ACTIVE";
    }

    public void update(String empName, String email, String phone, Department department, Position position,String status, LocalDateTime leaveDate) {
        this.empName = empName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.position = position;
        this.status = status;
        this.leaveDate = leaveDate;
    }
}
