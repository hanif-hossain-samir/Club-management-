import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { api } from '../services/api.ts';
import { INITIAL_USERS } from '../data/initialData.ts';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsDemo: (targetRole: UserRole, wing?: string) => Promise<void>;
  loginWithEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (data: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    semester?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const CUCC_CONTROLLER_USER: User = {
  id: 'usr-ctrl-1',
  name: 'Tanvir Ahmed',
  email: 'controller.tech@cityuniversity.edu',
  role: 'controller',
  studentId: 'CU-21-CSE-045',
  department: 'Computer Science & Engineering',
  semester: '7th Semester',
  clubAffiliation: 'computer_club',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  joinedAt: '2022-03-15',
  phone: '+880 1822-456789'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Exclusively logged in as CUCC Club Controller
  const [user, setUser] = useState<User | null>(() => {
    return CUCC_CONTROLLER_USER;
  });

  useEffect(() => {
    localStorage.setItem('cuec_current_user', JSON.stringify(CUCC_CONTROLLER_USER));
  }, []);

  const loginAsDemo = async (_targetRole?: UserRole, _wing?: string) => {
    setUser(CUCC_CONTROLLER_USER);
  };

  const loginWithEmail = async (email: string) => {
    try {
      const res = await api.login(email);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server error.' };
    }
  };

  const registerUser = async (data: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    semester?: string;
  }) => {
    try {
      const res = await api.register(data);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server error.' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await api.getUsers(user.id);
      if (res.success) {
        const found = res.users.find(u => u.id === user.id || u.studentId === user.studentId);
        if (found) setUser(found);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'user',
        isAuthenticated: !!user,
        loginAsDemo,
        loginWithEmail,
        registerUser,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
