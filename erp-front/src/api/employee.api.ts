import type { ApiResponse } from "../types/common";
import type {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  Position,
} from "../types/employee";
import axiosInstance from "./axiosInstance";

export const getEmployees = async (): Promise<Employee[]> => {
  const res =
    await axiosInstance.get<ApiResponse<Employee[]>>("/api/employees");
  return res.data.data;
};

export const getEmployee = async (id: number): Promise<Employee> => {
  const res = await axiosInstance.get<ApiResponse<Employee>>(
    `/api/employees/${id}`,
  );
  return res.data.data;
};

export const createEmployee = async (
  data: EmployeeCreateRequest,
): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<number>>(
    "/api/employees",
    data,
  );
  return res.data.data;
};

export const updateEmployee = async (
  id: number,
  data: EmployeeUpdateRequest,
): Promise<void> => {
  await axiosInstance.put(`/api/employees/${id}`, data);
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/employees/${id}`);
};

export const getPositions = async (): Promise<Position[]> => {
  const res =
    await axiosInstance.get<ApiResponse<Position[]>>("/api/positions");
  return res.data.data;
};
