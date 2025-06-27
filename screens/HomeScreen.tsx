import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';
import { defaultStyles } from '../constants/defaultStyles';
import { showToast } from '@/components/Toast';
import StyledModal from '../components/StyledModal';
import NewsArticleCard from '../components/NewsArticleCard';
import { Tag } from './tag/TagScreen';
import { Category } from './category/CategoryScreen';

type Props = DrawerScreenProps<DrawerParamList, 'Home'>;

type UserInteraction = {
  id: number;
  news_article: number;
  interaction_type: "like" | "dislike";
};

type ReadingListItem = {
  id: number;
  reading_list: number;
};

export type NewsArticle = {
  id: number;
  title: string;
  content: string;
  publication_date: string;
  total_likes: number;
  total_dislikes: number;
  user_interactions: UserInteraction[];
  reading_list_items: ReadingListItem[];
  tags: Tag[];
  categories: Category[];
};

type ReadingList = {
  id: number;
  name: string;
  user: number;
};

const HomeScreen = ({ navigation }: Props) => {
  const { userToken, userInfo, isLoading } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [showReadingListModal, setShowReadingListModal] = useState(false);
  const [selectedArticleForReadingList, setSelectedArticleForReadingList] = useState<NewsArticle | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const headers: HeadersInit = {};
        if (userToken) {
          headers['Authorization'] = `Token ${userToken}`;
        }
        const response = await fetch('http://localhost:8000/artigos/all/', { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        showToast('error', 'Erro', 'Falha ao carregar artigos de notícia.');
        console.error('Error fetching news articles:', error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();

    const fetchReadingLists = async () => {
      try {
        if (!userToken) {
          setReadingLists([]);
          return;
        }
        const headers: HeadersInit = {
          'Authorization': `Token ${userToken}`,
        };
        const response = await fetch('http://localhost:8000/listas-leitura/', { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReadingLists(data);
      } catch (error) {
        showToast('error', 'Erro', 'Falha ao carregar listas de leitura.');
        console.error('Error fetching reading lists:', error);
      }
    };

    fetchReadingLists();
  }, [userInfo, userToken]);

  const handleInteraction = async (articleId: number, interactionType: 'like' | 'dislike') => {
    if (!userToken) {
      alert('Você precisa estar logado para interagir com os artigos.');
      return;
    }

    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex === -1) return;

    const currentArticle = { ...articles[articleIndex] };
    let { total_likes = 0, total_dislikes = 0, user_interactions } = currentArticle;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${userToken}`,
    };

    try {
      const existingInteraction = user_interactions.find((interaction) => interaction.news_article === articleId);

      if (existingInteraction) {
        if (existingInteraction.interaction_type === interactionType) {
          await fetch(`http://localhost:8000/interacoes-usuario-artigo/${existingInteraction.id}/`, {
            method: 'DELETE',
            headers,
          });

          if (interactionType === 'like') {
            total_likes = Math.max(0, total_likes - 1);
          } else {
            total_dislikes = Math.max(0, total_dislikes - 1);
          }
          user_interactions = user_interactions.filter(ui => ui.id !== existingInteraction.id);

        } else {
          await fetch(`http://localhost:8000/interacoes-usuario-artigo/${existingInteraction.id}/`, {
            method: 'DELETE',
            headers,
          });

          if (existingInteraction.interaction_type === 'like') {
            total_likes = Math.max(0, total_likes - 1);
          } else {
            total_dislikes = Math.max(0, total_dislikes - 1);
          }
          user_interactions = user_interactions.filter(ui => ui.id !== existingInteraction.id);

          const postResponse = await fetch('http://localhost:8000/interacoes-usuario-artigo/', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              news_article: articleId,
              interaction_type: interactionType,
            }),
          });
          const newInteraction = await postResponse.json();

          if (interactionType === 'like') {
            total_likes += 1;
          } else {
            total_dislikes += 1;
          }
          user_interactions.push(newInteraction);
        }
      } else {
        const postResponse = await fetch('http://localhost:8000/interacoes-usuario-artigo/', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            news_article: articleId,
            interaction_type: interactionType,
          }),
        });
        const newInteraction = await postResponse.json();

        if (interactionType === 'like') {
          total_likes += 1;
        } else {
          total_dislikes += 1;
        }
        user_interactions.push(newInteraction);
      }

      setArticles(prevArticles => {
        const newArticles = [...prevArticles];
        newArticles[articleIndex] = {
          ...currentArticle,
          total_likes,
          total_dislikes,
          user_interactions,
        };
      
        return newArticles;
      });
    } catch (error) {
      console.error('Error interacting:', error);
      showToast('error', 'Erro', 'Erro ao registrar interação.');
    }
  };

  const handleAddArticleToReadingList = async (article: NewsArticle, readingListId: number) => {
    if (!userToken) {
      showToast('error', 'Erro', 'Você precisa estar logado para adicionar artigos à lista de leitura.');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${userToken}`,
    };

    const existingReadingListItem = article.reading_list_items.find((item) => item.reading_list === readingListId);

    try {
      if (existingReadingListItem) {
        await fetch(`http://localhost:8000/itens-lista-leitura/${existingReadingListItem.id}/`, {
          method: 'DELETE',
          headers,
        });
        showToast('success', 'Removido', `Artigo removido da lista de leitura "${readingLists.find(rl => rl.id === readingListId)?.name}"!`);

        setArticles((prevArticles) =>
          prevArticles.map((art) =>
            art.id === article.id
              ? {
                  ...art,
                  reading_list_items: art.reading_list_items.filter(
                    (item) => item.id !== existingReadingListItem.id
                  ),
                }
              : art
          )
        );
      } else {
        const response = await fetch('http://localhost:8000/itens-lista-leitura/', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            news_article: article.id,
            reading_list: readingListId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.non_field_errors && errorData.non_field_errors.includes('The fields reading_list, news_article must make a unique set.')) {
            showToast('info', 'Já Adicionado', 'Este artigo já está na sua lista de leitura.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}, ${JSON.stringify(errorData)}`);
          }
        } else {
          const newReadingListItem = await response.json();
          showToast('success', 'Sucesso', `Artigo adicionado à lista de leitura "${readingLists.find(rl => rl.id === readingListId)?.name}"!`);

          setArticles((prevArticles) =>
            prevArticles.map((art) =>
              art.id === article.id
                ? {
                    ...art,
                    reading_list_items: [...art.reading_list_items, newReadingListItem],
                  }
                : art
            )
          );
        }
      }
    } catch (error) {
      console.error('Error adding/removing article to reading list:', error);
      showToast('error', 'Erro', 'Erro ao adicionar/remover artigo da lista de leitura.');
    }
  };

  if (isLoading || loadingArticles) {
    return (
      <View style={defaultStyles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.activityIndicator} />
      </View>
    );
  }


  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.title}>Artigos de Notícias</Text>
      {articles.length > 0 ? (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NewsArticleCard
              article={item}
              onLike={(articleId) => handleInteraction(articleId, 'like')}
              onDislike={(articleId) => handleInteraction(articleId, 'dislike')}
              onAddToReadingList={(article) => {
                setSelectedArticleForReadingList(article);
                setShowReadingListModal(true);
              }}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text>Nenhum artigo de notícia disponível.</Text>
      )}

      <StyledModal
        visible={showReadingListModal}
        onClose={() => setShowReadingListModal(false)}
        title="Adicionar/Remover da Lista de Leitura"
      >
        {readingLists.length === 0 ? (
          <Text>Você não tem nenhuma lista de leitura. Crie uma primeiro.</Text>
        ) : (
          <FlatList
            data={readingLists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: readingList }) => {
              const isArticleInThisList = selectedArticleForReadingList?.reading_list_items.some(
                (rlItem) => rlItem.reading_list === readingList.id
              );
              return (
                <TouchableOpacity
                  style={styles.readingListItem}
                  onPress={() => {
                    if (selectedArticleForReadingList) {
                      handleAddArticleToReadingList(selectedArticleForReadingList, readingList.id);
                    }
                    setShowReadingListModal(false);
                  }}
                >
                  <Text style={styles.readingListName}>{readingList.name}</Text>
                  <Ionicons
                    name={isArticleInThisList ? "checkmark-circle" : "add-circle-outline"}
                    size={24}
                    color={isArticleInThisList ? Colors.primary : Colors.lightText}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </StyledModal>
    </View>
  );
};

const styles = StyleSheet.create({
  readingListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  readingListName: {
    fontSize: 16,
  },
});


export default HomeScreen;