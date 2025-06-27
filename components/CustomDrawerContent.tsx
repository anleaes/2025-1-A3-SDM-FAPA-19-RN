import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent = (props: any) => {
  const { signOut, userInfo} = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, padding: 10 }}>
      <View style={styles.header}>
        {userInfo && (
        <Text style={styles.name}>PEQUENIUM</Text>)}
      </View>
      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={Colors.red} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
    color: Colors.primary
  },
  name: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.red,
  },
});

export default CustomDrawerContent;