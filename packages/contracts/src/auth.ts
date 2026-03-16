export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}
