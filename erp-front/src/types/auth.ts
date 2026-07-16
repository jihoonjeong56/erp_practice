export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  name: string;
  role: string;
}

