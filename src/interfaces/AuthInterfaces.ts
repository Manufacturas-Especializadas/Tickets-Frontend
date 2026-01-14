export interface DecodedToken {
  nameid?: string;
  unique_name?: string;
  role?: string;
  PayRollNumber?: string;
  exp?: number;
}

export interface User {
  id: number;
  name: string;
  role: string;
  payRollNumber: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
}

export interface DecodedToken {
  nameid?: string;
  unique_name?: string;
  role?: string;

  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;

  PayRollNumber?: string;

  exp?: number;
  iss?: string;
  aud?: string;
}
