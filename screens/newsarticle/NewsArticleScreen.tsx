import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { showToast } from '../../components/Toast';
import StyledModal from '../../components/StyledModal';
import NewsArticleForm from '../../components/forms/NewsArticleForm';
import { useAuth } from '../../contexts/AuthContext';
import { Tag } from '../tag/TagScreen';
import { Category } from '../category/CategoryScreen';
import NewsArticleCard from '../../components/NewsArticleCard';
import { NewsArticle as HomeScreenNewsArticle } from '../HomeScreen'; // Import NewsArticle type from HomeScreen as HomeScreenNewsArticle

type Props = DrawerScreenProps<DrawerParamList, 'NewsArticle'>;

export type NewsArticle = {
  id: number;
  title: string;
  content: string;
  publication_date: string;
  tags: Tag[];
  categories: Category[];
  total_likes: number;
  total_dislikes: number;
  user_interactions: HomeScreenNewsArticle['user_interactions'];
  reading_list_items: HomeScreenNewsArticle['reading_list_items'];
};

const NewsArticleScreen = ({ navigation }: Props) => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | undefined>(undefined);
  const { userToken } = useAuth();

  const fetchNewsArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/artigos/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch news articles');
      }
      const data = await response.json();
      setNewsArticles(data);
    } catch (error: any) {
      showToast('error', 'Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNewsArticles();
    }, [userToken])
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/artigos/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete news article');
      }
      setNewsArticles(prev => prev.filter(article => article.id !== id));
      showToast('success', 'Success', 'News article deleted successfully!');
    } catch (error: any) {
      showToast('error', 'Error', error.message);
    }
  };

  const handleSave = () => {
    fetchNewsArticles();
  };

  const openCreateModal = () => {
    setSelectedArticle(undefined);
    setModalVisible(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <NewsArticleCard
      article={item}
      showOwnerActions={true}
      onEdit={(article) => openEditModal(article as NewsArticle)}
      onDelete={handleDelete}
      onLike={() => {}}
      onDislike={() => {}}
      onAddToReadingList={() => {}}
    />
  );

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.title}>Artigos de Notícias</Text>
      {loading ? (
        <ActivityIndicator size="large" color={defaultStyles.title.color} />
      ) : (
        <FlatList
          data={newsArticles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={defaultStyles.fab}
        onPress={openCreateModal}
      >
        <Ionicons name="add" size={28} color={defaultStyles.editText.color} />
      </TouchableOpacity>

      <StyledModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedArticle ? 'Editar Artigo de Notícia' : 'Criar Artigo de Notícia'}
      >
        <NewsArticleForm
          initialData={selectedArticle}
          onSave={handleSave}
          onClose={() => setModalVisible(false)}
        />
      </StyledModal>
    </View>
  );
};

export default NewsArticleScreen;