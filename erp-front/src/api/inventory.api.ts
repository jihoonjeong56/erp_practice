import type { ApiResponse } from "../types/common";
import type {
  Item,
  ItemCreateRequest,
  ItemUpdateRequest,
  Stock,
  StockHistory,
  StockTxRequest,
} from "../types/inventory";
import axiosInstance from "./axiosInstance";

// 품목
export const getItems = async (): Promise<Item[]> => {
  const res = await axiosInstance.get<ApiResponse<Item[]>>("/api/items");
  return res.data.data;
};

export const createItem = async (data: ItemCreateRequest): Promise<number> => {
  const res = await axiosInstance.post<ApiResponse<number>>("/api/items", data);
  return res.data.data;
};

export const updateItem = async (
  id: number,
  data: ItemUpdateRequest,
): Promise<void> => {
  await axiosInstance.put(`/api/items/${id}`, data);
};

export const getStocks = async (): Promise<Stock[]> => {
  const res = await axiosInstance.get<ApiResponse<Stock[]>>("/api/stocks");
  return res.data.data;
};

export const getStockHistories = async (
  itemId: number,
): Promise<StockHistory[]> => {
  const res = await axiosInstance.get<ApiResponse<StockHistory[]>>(
    `/api/stocks/${itemId}/histories`,
  );
  return res.data.data;
};

export const inboundStock = async (
  itemId: number,
  data: StockTxRequest,
): Promise<void> => {
  await axiosInstance.post(`/api/stocks/${itemId}/in`, data);
};

export const outboundStock = async (
  itemId: number,
  data: StockTxRequest,
): Promise<void> => {
  await axiosInstance.post(`/api/stocks/${itemId}/out`, data);
};
