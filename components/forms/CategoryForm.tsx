import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../Toast';
import { Category } from '../../screens/category/CategoryScreen';

interface CategoryFormProps {
  category: Category | null;
  onSave: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const { userToken } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [category]);

  const handleSave = async () => {
    setSaving(true);
    const method = category ? 'PUT' : 'POST';
    const url = category ? `http://localhost:8000/categorias/${category.id}/` : 'http://localhost:8000/categorias/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      showToast('success', 'Sucesso', `Categoria ${category ? 'atualizada' : 'criada'} com sucesso!`);
      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
      showToast('error', 'Erro', `Falha ao ${category ? 'atualizar' : 'criar'} categoria.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.label}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={defaultStyles.input}
      />
      <Text style={defaultStyles.label}>Descrição</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[defaultStyles.input, { height: 100 }]}
        multiline
      />
      {saving ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={defaultStyles.button} onPress={handleSave}>
            <Text style={defaultStyles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[defaultStyles.button, { backgroundColor: Colors.red, marginLeft: 10 }]} onPress={onCancel}>
            <Text style={defaultStyles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default CategoryForm;