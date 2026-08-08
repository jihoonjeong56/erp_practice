export interface CodeGroup {
  groupCode: string;
  groupName: string;
  description: string | null;
  useYn: string;
  codes: CommonCode[];
}

export interface CommonCode {
  id: number;
  groupCode: string;
  code: string;
  codeName: string;
  sortOrder: number;
  useYn: string;
}

export interface CodeGroupCreateRequest {
  groupCode: string;
  groupName: string;
  description?: string;
}

export interface CommonCodeCreateRequest {
  code: string;
  codeName: string;
  sortOrder: number;
}
