import type { CodeGroup, CodeGroupCreateRequest } from "../types/code";
import type { ApiResponse } from "../types/common";
import axiosInstance from "./axiosInstance";

export const getCodeGroups = async (): Promise<CodeGroup[]> => {
  const res =
    await axiosInstance.get<ApiResponse<CodeGroup[]>>("/api/codes/groups");
  return res.data.data;
};

// 코드 그룹 등록
export const createCodeGroup = async (
  data: CodeGroupCreateRequest,
): Promise<string> => {
  const res = await axiosInstance.post<ApiResponse<string>>(
    "/api/codes/groups",
    data,
  );
  return res.data.data;
};

export const updateCodeGroup = async(groupCode: string, data : CodeGroupCreateRequest)
