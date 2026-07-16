export interface Department {
  id: number;
  deptCode: string;
  deptName: string;
  description: string | null;
  sortOrder: number;
  useYn: string;
  parentId: number | null;
  parentName: string | null;
  children: Department[];
}
export interface DepartmentCreateRequest {
  deptCode: string;
  deptName: string;
  description?: string;
  sortOrder: number;
  parentId?: number | null;
}

export interface DepartmentUpdateRequest {
  deptName: string;
  description?: string;
  sortOrder: number;
  useYn: string;
  parentId?: number | null;
}
