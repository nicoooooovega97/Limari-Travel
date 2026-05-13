// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { loginAdmin, removeToken, setToken } from "../services/storageService";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⚠️ IMPORTANTE: Usar la MISMA clave que en storageService.tsx
const TOKEN_KEY = "token"; // <-- Cambiado de "admin_token" a "token"
const USERNAME_KEY = "username";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginAdmin(username, password);
      setToken(response.token); // Guarda con clave "token"
      localStorage.setItem(USERNAME_KEY, response.username);
      setIsAuthenticated(true);
      setUsername(response.username);
      console.log("Login exitoso, token guardado:", !!response.token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    removeToken(); // Elimina la clave "token"
    localStorage.removeItem(USERNAME_KEY);
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}