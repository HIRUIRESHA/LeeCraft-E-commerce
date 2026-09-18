export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
