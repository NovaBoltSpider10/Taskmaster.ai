import React, { createContext, useContext, useState, useEffect } from "react";

interface Class {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  classes?: Class[];
  tasks?: Task[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch("http://localhost:3000/api/users/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            console.error("Failed to fetch user");
            logout();
          }
        } catch (err) {
          console.error(err);
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
