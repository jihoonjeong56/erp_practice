import type { ApiResponse } from "../types/common";
import type { Position } from "../types/employee";
import type {
  PositionCreateRequest,
  PositionUpdateRequest,
} from "../types/position";
import axiosInstance from "./axiosInstance";

export const getPositions = async (): Promise<Position[]> => {
  const res =
    await axiosInstance.get<ApiResponse<Position[]>>("/api/positions");
  return res.data.data;
};

export const createPosition = async (
  data: PositionCreateRequest,
): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<number>>(
    "/api/positions",
    data,
  );
  return res.data.data;
};

export const updatePosition = async (
  id: number,
  data: PositionUpdateRequest,
): Promise<void> => {
  await axiosInstance.put(`/api/positions/${id}`, data);
};

export const deletePosition = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/positions/${id}`);
};
