import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../Toast';
import { ReadingList } from '../../screens/readinglist/ReadingListScreen';

interface ReadingListFormProps {
  readingList: ReadingList | null;
  onSave: () => void;
  onCancel: () => void;
}

const ReadingListForm: React.FC<ReadingListFormProps> = ({ readingList, onSave, onCancel }) => {
  const { userToken } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (readingList) {
      setName(readingList.name);
      setDescription(readingList.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [readingList]);

  const handleSave = async () => {
    setSaving(true);
    const method = readingList ? 'PUT' : 'POST';
    const url = readingList ? `http://localhost:8000/listas-leitura/${readingList.id}/` : 'http://localhost:8000/listas-leitura/';

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
        throw new Error('Failed to save reading list');
      }

      showToast('success', 'Sucesso', `Lista de leitura ${readingList ? 'atualizada' : 'criada'} com sucesso!`);
      onSave();
    } catch (error) {
      console.error('Error saving reading list:', error);
      showToast('error', 'Erro', `Falha ao ${readingList ? 'atualizar' : 'criar'} lista de leitura.`);
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

export default ReadingListForm;