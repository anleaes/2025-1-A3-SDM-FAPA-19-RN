import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '../constants/defaultStyles';
import { Colors } from '../constants/Colors';

interface StyledModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const StyledModal: React.FC<StyledModalProps> = ({ visible, onClose, children, title }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={defaultStyles.modalContainer}>
        <View style={defaultStyles.modalContent}>
          <TouchableOpacity onPress={onClose} style={defaultStyles.closeButton}>
            <Ionicons name="close-circle" size={28} color={Colors.red} />
          </TouchableOpacity>
          {title && <Text style={[defaultStyles.title, { marginBottom: 15 }]}>{title}</Text>}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default StyledModal;