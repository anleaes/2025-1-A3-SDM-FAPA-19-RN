import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../Toast';
import { NewsArticleTag } from '../../screens/newsarticletag/NewsArticleTagScreen';

interface NewsArticleTagFormProps {
  newsArticleTag: NewsArticleTag | null;
  onSave: () => void;
  onCancel: () => void;
}

const NewsArticleTagForm: React.FC<NewsArticleTagFormProps> = ({ newsArticleTag, onSave, onCancel }) => {
  const { userToken } = useAuth();
  const [newsArticleId, setNewsArticleId] = useState('');
  const [tagId, setTagId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (newsArticleTag) {
      setNewsArticleId(newsArticleTag.news_article.toString());
      setTagId(newsArticleTag.tag.toString());
    } else {
      setNewsArticleId('');
      setTagId('');
    }
  }, [newsArticleTag]);

  const handleSave = async () => {
    setSaving(true);
    const method = newsArticleTag ? 'PUT' : 'POST';
    const url = newsArticleTag ? `http://localhost:8000/artigos-tags/${newsArticleTag.id}/` : 'http://localhost:8000/artigos-tags/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({
          news_article: parseInt(newsArticleId),
          tag: parseInt(tagId),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save news article tag');
      }

      showToast('success', 'Sucesso', `Tag de artigo de notícia ${newsArticleTag ? 'atualizada' : 'criada'} com sucesso!`);
      onSave();
    } catch (error) {
      console.error('Error saving news article tag:', error);
      showToast('error', 'Erro', `Falha ao ${newsArticleTag ? 'atualizar' : 'criar'} tag de artigo de notícia.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.label}>ID do Artigo de Notícia</Text>
      <TextInput
        value={newsArticleId}
        onChangeText={setNewsArticleId}
        style={defaultStyles.input}
        keyboardType="numeric"
      />
      <Text style={defaultStyles.label}>ID da Tag</Text>
      <TextInput
        value={tagId}
        onChangeText={setTagId}
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

export default NewsArticleTagForm;