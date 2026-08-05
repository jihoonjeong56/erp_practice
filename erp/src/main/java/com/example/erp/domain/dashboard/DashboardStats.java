package com.example.erp.domain.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardStats {
    private final long totalEmployees;
    private final long activeEmployees;
    private final long leaveEmployees;
    private final long resignedEmployees;
    private final long totalDepartments;
    private final long totalPositions;
}
