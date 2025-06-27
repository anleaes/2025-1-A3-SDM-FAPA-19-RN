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
import ReadingListForm from '../../components/forms/ReadingListForm';

type Props = DrawerScreenProps<DrawerParamList, 'ReadingList'>;

export type ReadingList = {
  id: number;
  name: string;
  description: string;
};

const ReadingListScreen = ({ navigation }: Props) => {
  const { userToken } = useAuth();
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReadingList, setCurrentReadingList] = useState<ReadingList | null>(null);

  const fetchReadingLists = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/listas-leitura/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reading lists');
      }
      const data = await response.json();
      setReadingLists(data);
    } catch (error) {
      console.error('Error fetching reading lists:', error);
      showToast('error', 'Erro', 'Falha ao carregar listas de leitura.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReadingLists();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/listas-leitura/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete reading list');
      }
      setReadingLists(prev => prev.filter(rl => rl.id !== id));
      showToast('success', 'Sucesso', 'Lista de leitura excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting reading list:', error);
      showToast('error', 'Erro', 'Falha ao excluir lista de leitura.');
    }
  };

  const handleSave = () => {
    fetchReadingLists();
    setModalVisible(false);
    setCurrentReadingList(null);
  };

  const openCreateModal = () => {
    setCurrentReadingList(null);
    setModalVisible(true);
  };

  const openEditModal = (readingList: ReadingList) => {
    setCurrentReadingList(readingList);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: ReadingList }) => (
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
      <Text style={defaultStyles.title}>Listas de Leitura</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={readingLists}
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
        title={currentReadingList ? 'Editar Lista de Leitura' : 'Nova Lista de Leitura'}
      >
        <ReadingListForm
          readingList={currentReadingList}
          onSave={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </StyledModal>
    </View>
  );
};

export default ReadingListScreen;