// app/components/SortModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SORT_OPTIONS } from '../constants/notes';

// A helper object to provide user-friendly labels
const SORT_LABELS = {
  [SORT_OPTIONS.DATE_DESC]: "Date (Newest first)",
  [SORT_OPTIONS.DATE_ASC]: "Date (Oldest first)",
  [SORT_OPTIONS.TITLE_ASC]: "Title (A-Z)",
  [SORT_OPTIONS.TITLE_DESC]: "Title (Z-A)",
};

const SortModal = ({ visible, onClose, currentSortOption, onSelectSortOption, isDarkMode, translations }) => {
  const styles = getStyles(isDarkMode);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{translations.SortBy || 'Sort by'}</Text>
              {Object.values(SORT_OPTIONS).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionButton}
                  onPress={() => onSelectSortOption(option)}
                >
                  <MaterialIcons
                    name={currentSortOption === option ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={22}
                    color={currentSortOption === option ? '#d71921' : (isDarkMode ? '#fff' : '#000')}
                  />
                  <Text style={styles.optionText}>{SORT_LABELS[option] || option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: isDarkMode ? '#262626' : '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    marginLeft: 15,
  },
});

export default SortModal;