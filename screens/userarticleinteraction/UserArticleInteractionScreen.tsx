import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../components/Toast';
import StyledModal from '../../components/StyledModal';
import UserArticleInteractionForm from '../../components/forms/UserArticleInteractionForm';

type Props = DrawerScreenProps<DrawerParamList, 'UserArticleInteraction'>;

export type UserArticleInteraction = {
  id: number;
  user: number;
  news_article: number;
  interaction_type: string;
  timestamp: string;
};

const UserArticleInteractionScreen = ({ navigation }: Props) => {
  const { userToken } = useAuth();
  const [interactions, setInteractions] = useState<UserArticleInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<UserArticleInteraction | null>(null);

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/interacoes-usuario-artigo/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user article interactions');
      }
      const data = await response.json();
      setInteractions(data);
    } catch (error) {
      console.error('Error fetching user article interactions:', error);
      showToast('error', 'Erro', 'Falha ao carregar interações de usuário com artigo.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInteractions();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/interacoes-usuario-artigo/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete user article interaction');
      }
      setInteractions(prev => prev.filter(i => i.id !== id));
      showToast('success', 'Sucesso', 'Interação excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting user article interaction:', error);
      showToast('error', 'Erro', 'Falha ao excluir interação.');
    }
  };

  const handleSave = () => {
    fetchInteractions();
    setModalVisible(false);
    setCurrentInteraction(null);
  };

  const openCreateModal = () => {
    setCurrentInteraction(null);
    setModalVisible(true);
  };

  const openEditModal = (interaction: UserArticleInteraction) => {
    setCurrentInteraction(interaction);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: UserArticleInteraction }) => (
    <View style={defaultStyles.card}>
      <Text style={defaultStyles.name}>Usuário ID: {item.user}</Text>
      <Text style={defaultStyles.description}>Artigo ID: {item.news_article}</Text>
      <Text style={defaultStyles.description}>Tipo de Interação: {item.interaction_type}</Text>
      <Text style={defaultStyles.description}>Timestamp: {item.timestamp}</Text>
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
      <Text style={defaultStyles.title}>Interações de Usuário com Artigo</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={interactions}
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
        title={currentInteraction ? 'Editar Interação' : 'Nova Interação'}
      >
        <UserArticleInteractionForm
          interaction={currentInteraction}
          onSave={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </StyledModal>
    </View>
  );
};

export default UserArticleInteractionScreen;