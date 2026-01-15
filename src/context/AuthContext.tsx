import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../api/services/authService";
import type {
  DecodedToken,
  LoginResponse,
  User,
} from "../interfaces/AuthInterfaces";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (tokenData: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const decodeAndSetUser = useCallback((token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      const userData: User = {
        id: Number(
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || 0
        ),
        name:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "Usuario",
        role:
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || "User",
        payRollNumber: decoded.PayRollNumber || "",
      };

      setUser(userData);
    } catch (error) {
      console.error("Token inválido", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }, []);

  const login = useCallback(
    (tokenData: LoginResponse) => {
      localStorage.setItem("token", tokenData.accessToken);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
      decodeAndSetUser(tokenData.accessToken);
    },
    [decodeAndSetUser]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeAndSetUser(token);
    }
  }, [decodeAndSetUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "Admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
