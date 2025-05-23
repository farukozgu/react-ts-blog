
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'blog-app-user';
const USERS_STORAGE_KEY = 'blog-app-users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Helper to save user to local storage
  const saveUser = (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setUser(user);
  };

  // Helper to get/save all users
  const getUsers = (): Record<string, { name: string, email: string, password: string, profilePicture?: string }> => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, any>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Get users from storage
      const users = getUsers();
      
      // Check if email exists and password matches
      const userEmail = email.toLowerCase();
      const userFound = Object.entries(users).find(([id, userData]) => 
        userData.email.toLowerCase() === userEmail && userData.password === password
      );
      
      if (!userFound) {
        throw new Error("Invalid email or password");
      }

      const [userId, userData] = userFound;
      
      // Create user profile
      const userProfile: UserProfile = {
        id: userId,
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture
      };
      
      // Save user to state and storage
      saveUser(userProfile);
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Error",
        description: error?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Get current users
      const users = getUsers();
      
      // Check if email already exists
      const userEmail = email.toLowerCase();
      const emailExists = Object.values(users).some(
        (userData: any) => userData.email.toLowerCase() === userEmail
      );
      
      if (emailExists) {
        throw new Error("Email already in use");
      }
      
      // Generate a unique ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Add new user
      users[userId] = {
        name,
        email,
        password,
        profilePicture: undefined
      };
      
      // Save users
      saveUsers(users);
      
      // Create user profile
      const userProfile: UserProfile = {
        id: userId,
        name,
        email,
        profilePicture: undefined
      };
      
      // Save user to state and storage
      saveUser(userProfile);
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remove user from state and storage
      saveUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      if (!user) throw new Error("No user logged in");
      
      // Get current users
      const users = getUsers();
      
      if (!users[user.id]) {
        throw new Error("User not found");
      }
      
      // Update user data
      users[user.id] = {
        ...users[user.id],
        name: data.name !== undefined ? data.name : user.name,
        profilePicture: data.profilePicture !== undefined ? data.profilePicture : user.profilePicture
      };
      
      // Save users
      saveUsers(users);
      
      // Update user profile
      const updatedProfile = {
        ...user,
        ...data
      };
      
      // Save updated user
      saveUser(updatedProfile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset functionality (simplified)
  const resetCodes: Record<string, string> = {};

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setIsLoading(true);
      
      // Check if email exists
      const users = getUsers();
      const userEmail = email.toLowerCase();
      const userFound = Object.values(users).some(
        (userData: any) => userData.email.toLowerCase() === userEmail
      );
      
      if (!userFound) {
        // Don't reveal if email exists for security
        toast({
          title: "Success",
          description: "If the email exists, a verification code has been sent",
        });
        return;
      }
      
      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      resetCodes[email] = code;
      
      // In a real app, this would send an email
      console.log(`Reset code for ${email}: ${code}`);
      
      toast({
        title: "Success",
        description: "For demo purposes, check the console for the verification code",
      });
    } catch (error: any) {
      console.error('Failed to send reset email:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetCode = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      
      if (resetCodes[email] !== code) {
        throw new Error("Invalid verification code");
      }
      
      toast({
        title: "Success",
        description: "Code verified successfully",
      });
    } catch (error: any) {
      console.error('Failed to verify code:', error);
      toast({
        title: "Error",
        description: error?.message || "Invalid verification code",
        variant: "destructive",
      });
      throw error; // Re-throw to prevent UI state change
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      setIsLoading(true);
      
      if (resetCodes[email] !== code) {
        throw new Error("Invalid verification code");
      }
      
      // Update password
      const users = getUsers();
      const userEmail = email.toLowerCase();
      
      let userId: string | null = null;
      
      // Find the user with this email
      Object.entries(users).forEach(([id, userData]: [string, any]) => {
        if (userData.email.toLowerCase() === userEmail) {
          userId = id;
          userData.password = newPassword;
        }
      });
      
      if (!userId) {
        throw new Error("User not found");
      }
      
      // Save updated users
      saveUsers(users);
      
      // Remove the reset code
      delete resetCodes[email];
      
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: user ? { user } : null,
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout,
      updateProfile,
      sendPasswordResetEmail,
      verifyResetCode,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
