import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { NewsArticle as HomeScreenNewsArticle } from '../screens/HomeScreen';
import { NewsArticle as NewsArticleScreenNewsArticle } from '../screens/newsarticle/NewsArticleScreen';

type GenericNewsArticle = HomeScreenNewsArticle & Partial<NewsArticleScreenNewsArticle>;

type NewsArticleCardProps = {
  article: GenericNewsArticle;
  onLike: (articleId: number) => void;
  onDislike: (articleId: number) => void;
  onAddToReadingList: (article: GenericNewsArticle) => void;
  showOwnerActions?: boolean;
  onEdit?: (article: GenericNewsArticle) => void;
  onDelete?: (articleId: number) => void;
};

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({
  article,
  onLike,
  onDislike,
  onAddToReadingList,
  showOwnerActions = false,
  onEdit,
  onDelete,
}) => {
  const liked = article.user_interactions?.find(interaction => interaction.interaction_type === 'like');
  const disliked = article.user_interactions?.find(interaction => interaction.interaction_type === 'dislike');
  const isInReadingList = article.reading_list_items?.length > 0;

  return (
    <View style={styles.articleCard}>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.articleContent}>{article.content}</Text>
      <Text style={styles.articleDate}><Text style={styles.tagsCategoriesTitle}>Tags:</Text> {article.tags && article.tags.length > 0 && (
        article.tags.map((tag) => (
          <Text key={tag.id} style={styles.tagCategoryItem}>{tag.name}</Text>
        ))
      )} Publicado em: {article.publication_date}</Text>

      {(article.categories && article.categories.length > 0 || article.tags && article.tags.length > 0) && (
        <View style={styles.categoriesTagsWrapper}>
          {article.categories && article.categories.length > 0 && (
            <View style={[styles.tagsCategoriesContainer, article.tags && article.tags.length > 0 && { marginRight: 10 }]}>
              <Text style={styles.tagsCategoriesTitle}>Categorias:</Text>
              <View style={styles.tagsCategoriesList}>
                {article.categories.map((category) => (
                  <Text key={category.id} style={styles.tagCategoryItem}>{category.name}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {!showOwnerActions &&
        <View style={styles.interactionContainer}>
          <TouchableOpacity
            onPress={() => onLike(article.id)}
            style={styles.interactionButton}
          >
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={24}
              color={liked ? Colors.primary : Colors.lightText}
            />
            <Text style={styles.interactionText}>{article.total_likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDislike(article.id)}
            style={styles.interactionButton}
          >
            <Ionicons
              name={disliked ? 'thumbs-down' : 'thumbs-down-outline'}
              size={24}
              color={disliked ? Colors.primary : Colors.lightText}
            />
            <Text style={styles.interactionText}>{article.total_dislikes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAddToReadingList(article)}
            style={styles.interactionButton}
          >
            <Ionicons
              name={isInReadingList ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isInReadingList ? Colors.primary : Colors.lightText}
            />
            <Text style={styles.interactionText}>{isInReadingList ? "Na Lista" : "Ler Depois"}</Text>
          </TouchableOpacity>
        </View>}
      {showOwnerActions && (
        <View style={styles.ownerActionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit && onEdit(article)}
          >
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete && onDelete(article.id)}
          >
            <Text style={styles.editText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  articleCard: {
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.text,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  articleContent: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 10,
  },
  articleDate: {
    fontSize: 12,
    color: Colors.lightText,
    fontStyle: 'italic',
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: Colors.background,
  },
  interactionText: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.text,
  },
  ownerActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  editButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    padding: 8,
    borderRadius: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: '500',
  },
  categoriesTagsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  tagsCategoriesContainer: {
    flex: 1,
  },
  tagsCategoriesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  tagsCategoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagCategoryItem: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
  },
});

export default NewsArticleCard;