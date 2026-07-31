export interface Employee {
  id: number;
  empNo: string;
  empName: string;
  email: string;
  phone: string | null;
  deptId: number;
  deptName: string;
  positionId: number;
  positionName: string;
  hireDate: string;
  leaveDate: string | null;
  status: string;
}

export interface EmployeeCreateRequest {
  empNo: string;
  empName: string;
  email: string;
  phone?: string;
  deptId: number;
  positionId: number;
  hireDate: string;
}

export interface EmployeeUpdateRequest {
  empName: string;
  email: string;
  phone?: string;
  depId: number;
  positionId: number;
  status: string;
  leaveDate?: string | null;
}

export interface Position {
  id: number;
  posCode: string;
  posName: string;
  level: number;
  useYn: string;
}
