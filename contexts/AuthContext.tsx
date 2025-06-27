import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userToken: string | null;
  userInfo: any | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
        if (token) {
          const info = await fetchUserInfo(token);
          setUserInfo(info);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    setUserToken(token);
    const info = await fetchUserInfo(token);
    setUserInfo(info);
  };

  const signOut = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await fetch('http://localhost:8000/usuario/deslogar/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
      }
    } catch (e) {
      console.error('Failed to logout on server', e);
    } finally {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUserInfo(null);
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/usuario/informacoes/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch user info:', response.status, response.statusText);
        return null;
      }
    } catch (e) {
      console.error('Failed to get user info', e);
      return null;
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ userToken, userInfo, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};