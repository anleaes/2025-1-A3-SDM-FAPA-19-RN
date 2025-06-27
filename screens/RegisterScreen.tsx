import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { showToast } from '../components/Toast';
import { defaultStyles } from '../constants/defaultStyles';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStack';

type Props = StackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showToast('error', 'Erro de Registro', 'As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/usuario/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Registro bem-sucedido!', 'Sua conta foi criada. Faça login para continuar.');
        navigation.navigate('Login');
      } else {
        const errorMessage = data.username ? data.username[0] :
                             data.email ? data.email[0] :
                             data.password ? data.password[0] :
                             data.non_field_errors ? data.non_field_errors[0] :
                             'Erro desconhecido. Por favor, tente novamente.';
        showToast('error', 'Falha no Registro', errorMessage);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      showToast('error', 'Erro de Registro', error.message || 'Algo deu errado. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <View style={defaultStyles.centeredContainer}>
      <Text style={defaultStyles.title}>Criar Conta</Text>
      <Text style={defaultStyles.label}>Username</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder="Digite seu nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={defaultStyles.label}>Email</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={defaultStyles.label}>Password</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={defaultStyles.label}>Confirm Password</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[defaultStyles.button, defaultStyles.formButton]} onPress={handleRegister}>
        <Text style={defaultStyles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loginText: {
    marginTop: 20,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;