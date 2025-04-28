import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UserProfile {
  username: string;
  email: string;
  firstName: string; // Added
  lastName: string;  // Added
  profileImageUrl: string | null;
}

interface UserContextProps {
  user: UserProfile | null;
  setUserProfile: (profileData: Partial<UserProfile>) => void; // Allow partial updates
  logout: () => void;
  // Add login function if needed
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const defaultUser: UserProfile = {
  username: 'defaultUser', // Placeholder
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  profileImageUrl: null, // Default to no image
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Try to load user from localStorage
    const savedUser = localStorage.getItem('userData');
    try {
      return savedUser ? JSON.parse(savedUser) : defaultUser; // Use default if nothing saved
    } catch (e) {
      console.error("Failed to parse saved user data:", e);
      return defaultUser; // Fallback to default on parse error
    }
  });

  useEffect(() => {
    // Persist user data changes to localStorage
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user]);

  const setUserProfile = (profileData: Partial<UserProfile>) => {
    setUser((currentUser) => {
        if (!currentUser) return null; // Should not happen if logged in
        // Merge new data with existing data
        const updatedUser = { ...currentUser, ...profileData };
        return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    // Optionally clear other related storage
  };

  // Add login function here if needed, which would set the initial user state

  return (
    <UserContext.Provider value={{ user, setUserProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 