export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user' | 'viewer';
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  expiresIn: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
