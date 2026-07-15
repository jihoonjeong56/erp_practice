export interface Departmnet {
  id: number;
  deptCode: string;
  deptName: string;
  description: string | null;
  sortOrder: number;
  useYn: string;
  parentId: number | null;
  parentName: string | null;
  children: Departmnet[];
}
export interface DepartmnetCreateRequest {}
