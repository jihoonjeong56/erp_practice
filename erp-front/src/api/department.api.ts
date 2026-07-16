
import type { ApiResponse } from "../types/common";
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
} from "../types/department";
import axiosInstance from "./axiosInstance";

// 전체조회
export const getDepartments = async (): Promise<Department[]> => {
  const res =
    await axiosInstance.get<ApiResponse<Department[]>>("/api/departments");
  return res.data.data;
};

// 트리구조 조회
export const getDepartmentTree = async (): Promise<Department[]> => {
  const res = await axiosInstance.get<ApiResponse<Department[]>>(
    "/api/departments/tree",
  );
  return res.data.data;
};

// 단건 조회
export const getDepartment = async (id: number): Promise<Department> => {
  const res = await axiosInstance.get<ApiResponse<Department>>(
    `/api/departments/${id}`,
  );
  return res.data.data;
};

// 등록
export const createDepartment = async (
  data: DepartmentCreateRequest,
): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<number>>(
    "/api/departments",
    data,
  );
  return res.data.data;
};

// 수정
export const updateDepartment = async (
  id: number,
  data: DepartmentUpdateRequest,
): Promise<void> => {
  await axiosInstance.put(`/api/departments/${id}`, data);
};

// 삭제
export const deleteDepartment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/departments/${id}`);
};
