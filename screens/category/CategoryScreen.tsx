import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../components/Toast';
import StyledModal from '../../components/StyledModal';
import CategoryForm from '../../components/forms/CategoryForm';

type Props = DrawerScreenProps<DrawerParamList, 'Categories'>;

export type Category = {
  id: number;
  name: string;
  description: string;
};

const CategoriesScreen = ({ navigation }: Props) => {
  const { userToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/categorias/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('error', 'Erro', 'Falha ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/categorias/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast('success', 'Sucesso', 'Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('error', 'Erro', 'Falha ao excluir categoria.');
    }
  };

  const handleSave = () => {
    fetchCategories();
    setModalVisible(false);
    setCurrentCategory(null);
  };

  const openCreateModal = () => {
    setCurrentCategory(null);
    setModalVisible(true);
  };

  const openEditModal = (category: Category) => {
    setCurrentCategory(category);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={defaultStyles.card}>
      <Text style={defaultStyles.name}>{item.name}</Text>
      <Text style={defaultStyles.description}>{item.description}</Text>
      <View style={defaultStyles.row}>
        <TouchableOpacity
          style={defaultStyles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={defaultStyles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={defaultStyles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={defaultStyles.editText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.title}>Categorias</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={defaultStyles.fab}
        onPress={openCreateModal}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      <StyledModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={currentCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <CategoryForm
          category={currentCategory}
          onSave={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </StyledModal>
    </View>
  );
};

export default CategoriesScreen;