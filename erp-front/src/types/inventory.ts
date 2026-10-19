export interface item {
  id: number;
  itemCode: string;
  itemName: string;
  unit: string;
  safetyStock: number;
  useYn: string;
}

export interface ItemCreateRequest {
  itemCode: string;
  itemName: string;
  unit: string;
  safetyStock: number;
}

export interface ItemUpdateRequest {
  itemName: string;
  unit: string;
  safetyStock: number;
  useYn: string;
}

export interface Stock {
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  safetyStock: number;
  lowStock: boolean;
}

export type StockTxType = "IN" | "OUT";

export interface StockHistory {
  id: number;
  itemId: number;
  itemName: string;
  txType: StockTxType;
  quantity: number;
  afterQuantity: number;
  memo: string | null;
  processedBy: string | null;
  createdAt: string | null;
}

export interface StockTxRequest {
  quantity: number;
  momo?: string;
}
