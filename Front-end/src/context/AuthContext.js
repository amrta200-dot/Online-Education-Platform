import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // التأكد من الجلسة عن طريق الـ Cookie
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/protected`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      const data = await response.json();
      setIsLoggedIn(true);
      setUser(data.user);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  // بعد نجاح تسجيل الدخول / التسجيل
  // الـ Backend يكون بالفعل وضع الـ Cookie
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}