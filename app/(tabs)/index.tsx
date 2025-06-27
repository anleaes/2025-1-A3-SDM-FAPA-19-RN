import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import AuthNavigator from '@/navigation/AuthStack';
import { registerRootComponent } from 'expo';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';

const AppContent = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {userToken ? <DrawerNavigator /> : <AuthNavigator />}
      <Toast />
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

registerRootComponent(App);
