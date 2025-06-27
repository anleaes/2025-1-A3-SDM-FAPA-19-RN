import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../Toast';
import { NewsArticleCategory } from '../../screens/newsarticlecategory/NewsArticleCategoryScreen';

interface NewsArticleCategoryFormProps {
  newsArticleCategory: NewsArticleCategory | null;
  onSave: () => void;
  onCancel: () => void;
}

const NewsArticleCategoryForm: React.FC<NewsArticleCategoryFormProps> = ({ newsArticleCategory, onSave, onCancel }) => {
  const { userToken } = useAuth();
  const [newsArticleId, setNewsArticleId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (newsArticleCategory) {
      setNewsArticleId(newsArticleCategory.news_article.toString());
      setCategoryId(newsArticleCategory.category.toString());
    } else {
      setNewsArticleId('');
      setCategoryId('');
    }
  }, [newsArticleCategory]);

  const handleSave = async () => {
    setSaving(true);
    const method = newsArticleCategory ? 'PUT' : 'POST';
    const url = newsArticleCategory ? `http://localhost:8000/artigos-categorias/${newsArticleCategory.id}/` : 'http://localhost:8000/artigos-categorias/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({
          news_article: parseInt(newsArticleId),
          category: parseInt(categoryId),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save news article category');
      }

      showToast('success', 'Sucesso', `Categoria de artigo de notícia ${newsArticleCategory ? 'atualizada' : 'criada'} com sucesso!`);
      onSave();
    } catch (error) {
      console.error('Error saving news article category:', error);
      showToast('error', 'Erro', `Falha ao ${newsArticleCategory ? 'atualizar' : 'criar'} categoria de artigo de notícia.`);
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
      <Text style={defaultStyles.label}>ID da Categoria</Text>
      <TextInput
        value={categoryId}
        onChangeText={setCategoryId}
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

export default NewsArticleCategoryForm;