
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

// ✅ EXPORT AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

// ✅ EXPORT AuthProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const loginUser = async (email: string, password: string) => {
    const res = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    localStorage.setItem("token", data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
