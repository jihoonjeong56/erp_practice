import type { ApiResponse } from "../types/common";
import type { DashboardStats } from "../types/dashboard";
import axiosInstance from "./axiosInstance";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await axiosInstance.get<ApiResponse<DashboardStats>>(
    "/api/dashboard/stats",
  );
  return res.data.data;
};
