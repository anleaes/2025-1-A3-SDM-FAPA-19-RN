import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { showToast } from '../Toast';
import { useAuth } from '../../contexts/AuthContext';

import { Tag } from '../../screens/tag/TagScreen';
import { Category } from '../../screens/category/CategoryScreen';

interface NewsArticleFormProps {
  initialData?: { id: number; title: string; content: string; tags: Tag[]; categories: Category[]; };
  onSave: () => void;
  onClose: () => void;
}

const NewsArticleForm: React.FC<NewsArticleFormProps> = ({ initialData, onSave, onClose }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const { userToken } = useAuth();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setSelectedTagIds(initialData.tags.map(tag => tag.id));
      setSelectedCategoryIds(initialData.categories.map(category => category.id));
    } else {
      setTitle('');
      setContent('');
      setSelectedTagIds([]);
      setSelectedCategoryIds([]);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchAllTagsAndCategories = async () => {
      try {
        const tagsResponse = await fetch('http://localhost:8000/tags/', {
          headers: { 'Authorization': `Token ${userToken}` },
        });
        const tagsData = await tagsResponse.json();
        setAllTags(tagsData);

        const categoriesResponse = await fetch('http://localhost:8000/categorias/', {
          headers: { 'Authorization': `Token ${userToken}` },
        });
        const categoriesData = await categoriesResponse.json();
        setAllCategories(categoriesData);
      } catch (error: any) {
        showToast('error', 'Erro', 'Falha ao carregar tags e categorias.');
      }
    };
    fetchAllTagsAndCategories();
  }, [userToken]);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const method = initialData ? 'PUT' : 'POST';
    const url = initialData
      ? `http://localhost:8000/artigos/${initialData.id}/`
      : 'http://localhost:8000/artigos/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({ title, content, tag_ids: selectedTagIds, category_ids: selectedCategoryIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      showToast('success', 'Sucesso', `Artigo de notícia ${initialData ? 'atualizado' : 'criado'} com sucesso!`);
      onSave();
      onClose();
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={defaultStyles.label}>Título</Text>
      <TextInput
        style={defaultStyles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
      />

      <Text style={defaultStyles.label}>Conteúdo</Text>
      <TextInput
        style={[defaultStyles.input, { height: 100 }]}
        value={content}
        onChangeText={setContent}
        placeholder="Digite o conteúdo"
        multiline
      />

      <Text style={defaultStyles.label}>Tags</Text>
      <View style={defaultStyles.tagContainer}>
        {allTags.map(tag => (
          <TouchableOpacity
            key={tag.id}
            style={[
              defaultStyles.tagButton,
              selectedTagIds.includes(tag.id) && defaultStyles.tagButtonSelected,
            ]}
            onPress={() => toggleTag(tag.id)}
          >
            <Text
              style={[
                defaultStyles.tagButtonText,
                selectedTagIds.includes(tag.id) && defaultStyles.tagButtonTextSelected,
              ]}
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={defaultStyles.label}>Categorias</Text>
      <View style={defaultStyles.tagContainer}>
        {allCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              defaultStyles.tagButton,
              selectedCategoryIds.includes(category.id) && defaultStyles.tagButtonSelected,
            ]}
            onPress={() => toggleCategory(category.id)}
          >
            <Text
              style={[
                defaultStyles.tagButtonText,
                selectedCategoryIds.includes(category.id) && defaultStyles.tagButtonTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={defaultStyles.buttonContainer}>
        <TouchableOpacity
          style={[defaultStyles.button, defaultStyles.halfWidthButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={defaultStyles.buttonText.color} />
          ) : (
            <Text style={defaultStyles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[defaultStyles.button, defaultStyles.halfWidthButton, { backgroundColor: defaultStyles.deleteButton.backgroundColor }]}
          onPress={onClose}
          disabled={loading}
        >
          <Text style={defaultStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewsArticleForm;