import type {
  CodeGroup,
  CodeGroupCreateRequest,
  CodeGroupUpdateRequest,
  CommonCode,
  CommonCodeCreateRequest,
  CommonCodeUpdateRequest,
} from "../types/code";
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

export const updateCodeGroup = async (
  groupCode: string,
  data: CodeGroupUpdateRequest,
): Promise<void> => {
  await axiosInstance.put(`/api/codes/groups${groupCode}`, data);
};

export const getCommonCode = async (
  groupCode: string,
): Promise<CommonCode[]> => {
  const res = await axiosInstance.get<ApiResponse<CommonCode[]>>(
    `/api/codes/groups/${groupCode}/codes`,
  );
  return res.data.data;
};

export const createCommonCode = async (
  groupCode: string,
  data: CommonCodeCreateRequest,
): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<number>>(
    `/api/codes/groups/${groupCode}/codes`,
    data,
  );
  return res.data.data;
};

export const updateCommonCode = async (
  groupCode: string,
  codeId: number,
  data: CommonCodeUpdateRequest,
): Promise<void> => {
  await axiosInstance.put(
    `/api/codes/groups/${groupCode}/codes/${codeId}`,
    data,
  );
};

export const deleteCommonCode = async (
  groupCode: string,
  codeId: number,
): Promise<void> => {
  await axiosInstance.delete(`/api/codes/groups/${groupCode}/codes/${codeId}`);
};
