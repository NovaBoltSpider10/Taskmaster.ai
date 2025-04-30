import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UserProfile {
  username: string;
  email: string;
  firstName: string; // Added
  lastName: string;  // Added
  profileImageUrl: string | null;
}

// Define the structure for personality data
export interface PersonalityData {
  introversionExtroversion: number; // 0-100
  preferredTime: 'Morning' | 'Afternoon' | 'Evening' | null;
  interactionType: 'In Person' | 'Virtual' | null;
  preferredSpace: 'Public' | 'Private' | null; // Relevant only if interactionType is 'In Person'
}

interface UserContextProps {
  user: UserProfile | null;
  setUserProfile: (profileData: Partial<UserProfile>) => void; // Allow partial updates
  logout: () => void;
  // Add login function if needed
  personalityData: PersonalityData | null; // Add personality state
  isPersonalityComplete: boolean; // Add completion flag
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// Default user profile data
const defaultUser: UserProfile = {
  username: 'defaultUser', // Placeholder
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  profileImageUrl: null, // Default to no image
};

// Default/initial personality data
const defaultPersonalityData: PersonalityData = {
  introversionExtroversion: 50, // Default to middle
  preferredTime: null,
  interactionType: null,
  preferredSpace: null,
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Profile State & Persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('userData');
    try {
      return savedUser ? JSON.parse(savedUser) : defaultUser;
    } catch (e) {
      console.error("Failed to parse saved user data:", e);
      return defaultUser;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user]);

  // Personality Data State & Persistence
  const [personalityData, setPersonalityData] = useState<PersonalityData | null>(() => {
    const savedPersonality = localStorage.getItem('personalityData');
    try {
        // Parse if exists, otherwise use default *if* user exists, else null
      return savedPersonality ? JSON.parse(savedPersonality) : (user ? defaultPersonalityData : null);
    } catch (e) {
      console.error("Failed to parse saved personality data:", e);
      // Fallback to default if user exists, else null
      return user ? defaultPersonalityData : null;
    }
  });

   useEffect(() => {
    // Also clear personality data on logout
    if (!user && personalityData) {
        setPersonalityData(null);
        localStorage.removeItem('personalityData');
    }
    // Initialize personality data if user logs in and it doesn't exist
    else if (user && !personalityData) {
        const savedPersonality = localStorage.getItem('personalityData');
        if (savedPersonality) {
            try {
                setPersonalityData(JSON.parse(savedPersonality));
            } catch (e) {
                 console.error("Failed to parse saved personality data on user load:", e);
                 setPersonalityData(defaultPersonalityData);
            }
        } else {
            setPersonalityData(defaultPersonalityData); // Initialize with defaults
        }
    }
    // Persist personality data changes to localStorage
    else if (personalityData) {
        localStorage.setItem('personalityData', JSON.stringify(personalityData));
    }
  }, [user, personalityData]); // Re-run if user or personalityData changes

  // Personality Completion State
  const [isPersonalityComplete, setIsPersonalityComplete] = useState<boolean>(false);

  useEffect(() => {
    // Calculate completion status whenever personalityData changes
    if (!personalityData) {
        setIsPersonalityComplete(false);
        return;
    }
    const { introversionExtroversion, preferredTime, interactionType, preferredSpace } = personalityData;
    let complete = true;
    if (introversionExtroversion === null || introversionExtroversion < 0 || introversionExtroversion > 100) complete = false; // Slider always has a value, check range just in case
    if (!preferredTime) complete = false;
    if (!interactionType) complete = false;
    if (interactionType === 'In Person' && !preferredSpace) complete = false; // Conditional check

    setIsPersonalityComplete(complete);

  }, [personalityData]);


  // Update User Profile Function
  const setUserProfile = (profileData: Partial<UserProfile>) => {
    setUser((currentUser) => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, ...profileData };
        return updatedUser;
    });
  };

  // Update Personality Data Function
  const updatePersonalityData = (data: Partial<PersonalityData>) => {
    setPersonalityData(currentData => {
        if (!currentData) return defaultPersonalityData; // Initialize if null
        const updatedData = { ...currentData, ...data };
        // Reset preferredSpace if interactionType changes away from 'In Person'
        if (data.interactionType && data.interactionType !== 'In Person') {
            updatedData.preferredSpace = null;
        }
        return updatedData;
    });
  };


  // Logout Function
  const logout = () => {
    setUser(null);
    setPersonalityData(null); // Clear personality data on logout
    localStorage.removeItem('userData');
    localStorage.removeItem('personalityData');
  };

  return (
    <UserContext.Provider value={{ user, setUserProfile, logout, personalityData, isPersonalityComplete }}>
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