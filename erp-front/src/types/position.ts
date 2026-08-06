export interface Position {
  id: number;
  posCode: string;
  posName: string;
  level: number;
  useYn: string;
}

export interface PositionCreateRequest {
  posCode: string;
  posName: string;
  level: number;
}

export interface PositionUpdateRequest {
  posName: string;
  level: number;
  useYn: string;
}
