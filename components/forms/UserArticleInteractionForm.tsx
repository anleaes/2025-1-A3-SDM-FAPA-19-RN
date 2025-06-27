import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../Toast';
import { UserArticleInteraction } from '../../screens/userarticleinteraction/UserArticleInteractionScreen';

interface UserArticleInteractionFormProps {
  interaction: UserArticleInteraction | null;
  onSave: () => void;
  onCancel: () => void;
}

const UserArticleInteractionForm: React.FC<UserArticleInteractionFormProps> = ({ interaction, onSave, onCancel }) => {
  const { userToken } = useAuth();
  const [userId, setUserId] = useState('');
  const [newsArticleId, setNewsArticleId] = useState('');
  const [interactionType, setInteractionType] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (interaction) {
      setUserId(interaction.user.toString());
      setNewsArticleId(interaction.news_article.toString());
      setInteractionType(interaction.interaction_type);
      setTimestamp(interaction.timestamp);
    } else {
      setUserId('');
      setNewsArticleId('');
      setInteractionType('');
      setTimestamp('');
    }
  }, [interaction]);

  const handleSave = async () => {
    setSaving(true);
    const method = interaction ? 'PUT' : 'POST';
    const url = interaction ? `http://localhost:8000/interacoes-usuario-artigo/${interaction.id}/` : 'http://localhost:8000/interacoes-usuario-artigo/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({
          user: parseInt(userId),
          news_article: parseInt(newsArticleId),
          interaction_type: interactionType,
          timestamp: timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user article interaction');
      }

      showToast('success', 'Sucesso', `Interação ${interaction ? 'atualizada' : 'criada'} com sucesso!`);
      onSave();
    } catch (error) {
      console.error('Error saving user article interaction:', error);
      showToast('error', 'Erro', `Falha ao ${interaction ? 'atualizar' : 'criar'} interação.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.label}>ID do Usuário</Text>
      <TextInput
        value={userId}
        onChangeText={setUserId}
        style={defaultStyles.input}
        keyboardType="numeric"
      />
      <Text style={defaultStyles.label}>ID do Artigo de Notícia</Text>
      <TextInput
        value={newsArticleId}
        onChangeText={setNewsArticleId}
        style={defaultStyles.input}
        keyboardType="numeric"
      />
      <Text style={defaultStyles.label}>Tipo de Interação</Text>
      <TextInput
        value={interactionType}
        onChangeText={setInteractionType}
        style={defaultStyles.input}
      />
      <Text style={defaultStyles.label}>Timestamp (YYYY-MM-DDTHH:MM:SSZ)</Text>
      <TextInput
        value={timestamp}
        onChangeText={setTimestamp}
        style={defaultStyles.input}
        placeholder="Ex: 2023-10-27T10:00:00Z"
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

export default UserArticleInteractionForm;