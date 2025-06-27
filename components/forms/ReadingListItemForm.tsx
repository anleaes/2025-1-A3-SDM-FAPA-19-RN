import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../Toast';
import { ReadingListItem } from '../../screens/readinglistitem/ReadingListItemScreen';

interface ReadingListItemFormProps {
  readingListItem: ReadingListItem | null;
  onSave: () => void;
  onCancel: () => void;
}

const ReadingListItemForm: React.FC<ReadingListItemFormProps> = ({ readingListItem, onSave, onCancel }) => {
  const { userToken } = useAuth();
  const [readingListId, setReadingListId] = useState('');
  const [newsArticleId, setNewsArticleId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (readingListItem) {
      setReadingListId(readingListItem.reading_list.toString());
      setNewsArticleId(readingListItem.news_article.toString());
    } else {
      setReadingListId('');
      setNewsArticleId('');
    }
  }, [readingListItem]);

  const handleSave = async () => {
    setSaving(true);
    const method = readingListItem ? 'PUT' : 'POST';
    const url = readingListItem ? `http://localhost:8000/itens-lista-leitura/${readingListItem.id}/` : 'http://localhost:8000/itens-lista-leitura/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({
          reading_list: parseInt(readingListId),
          news_article: parseInt(newsArticleId),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reading list item');
      }

      showToast('success', 'Sucesso', `Item da lista de leitura ${readingListItem ? 'atualizado' : 'criado'} com sucesso!`);
      onSave();
    } catch (error) {
      console.error('Error saving reading list item:', error);
      showToast('error', 'Erro', `Falha ao ${readingListItem ? 'atualizar' : 'criar'} item da lista de leitura.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.label}>ID da Lista de Leitura</Text>
      <TextInput
        value={readingListId}
        onChangeText={setReadingListId}
        style={defaultStyles.input}
        keyboardType="numeric"
      />
      <Text style={defaultStyles.label}>ID do Artigo de Notícia</Text>
      <TextInput
        value={newsArticleId}
        onChangeText={setNewsArticleId}
        style={defaultStyles.input}
        keyboardType="numeric"
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

export default ReadingListItemForm;