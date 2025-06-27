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
import TagForm from '../../components/forms/TagForm';

type Props = DrawerScreenProps<DrawerParamList, 'Tag'>;

export type Tag = {
  id: number;
  name: string;
  description: string;
};

const TagScreen = ({ navigation }: Props) => {
  const { userToken } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/tags/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      showToast('error', 'Erro', 'Falha ao carregar tags.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTags();
    }, [])
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/tags/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }
      setTags(prev => prev.filter(t => t.id !== id));
      showToast('success', 'Sucesso', 'Tag excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting tag:', error);
      showToast('error', 'Erro', 'Falha ao excluir tag.');
    }
  };

  const handleSave = () => {
    fetchTags();
    setModalVisible(false);
    setCurrentTag(null);
  };

  const openCreateModal = () => {
    setCurrentTag(null);
    setModalVisible(true);
  };

  const openEditModal = (tag: Tag) => {
    setCurrentTag(tag);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Tag }) => (
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
      <Text style={defaultStyles.title}>Tags</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={tags}
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
        title={currentTag ? 'Editar Tag' : 'Nova Tag'}
      >
        <TagForm
          tag={currentTag}
          onSave={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </StyledModal>
    </View>
  );
};

export default TagScreen;