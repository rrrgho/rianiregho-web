export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
}
