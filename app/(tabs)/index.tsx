import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import AuthNavigator from '@/navigation/AuthStack';
import { registerRootComponent } from 'expo';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const AppContent = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <NavigationContainer>
      {userToken ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

registerRootComponent(App);