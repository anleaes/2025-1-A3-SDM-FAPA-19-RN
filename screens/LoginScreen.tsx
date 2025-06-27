import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toast';
import { defaultStyles } from '../constants/defaultStyles';
import { AuthStackParamList } from '../navigation/AuthStack';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/token-autenticacao/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Login bem-sucedido!', 'Bem-vindo de volta!');
        await signIn(data.token);
      } else {
        showToast('error', 'Falha no Login', data.non_field_errors ? data.non_field_errors[0] : 'Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      showToast('error', 'Erro de Login', error.message || 'Algo deu errado. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <View style={defaultStyles.centeredContainer}>
      <Text style={defaultStyles.title}>Pequenium</Text>
      <Text style={defaultStyles.label}>Username</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={defaultStyles.label}>Password</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[defaultStyles.button, defaultStyles.formButton]} onPress={handleLogin}>
        <Text style={defaultStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Não tem uma conta? Registre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerText: {
    marginTop: 20,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});


export default LoginScreen;