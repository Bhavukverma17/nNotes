import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const DeleteModal = ({
  visible,
  onClose,
  onConfirm,
  selectedCount,
  isDarkMode,
  translations,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? "#141414" : "white" },
          ]}
        >
          <Text style={styles.modalTitle}>Delete Notes</Text>
          <Text
            style={[
              styles.modalMessage,
              { color: isDarkMode ? "#fff" : "black" },
            ]}
          >
            {selectedCount > 1
              ? `${translations.DMess} ${selectedCount} notes?`
              : translations.DMess}
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              accessible={true}
              accessibilityLabel="Cancel deletion"
            >
              <Text style={styles.buttonText}>{translations.Cancel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
              accessible={true}
              accessibilityLabel="Confirm deletion"
            >
              <Text style={styles.buttonText}>{translations.Del}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d71921",
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#3c3c3c",
  },
  deleteButton: {
    backgroundColor: "#d71921",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeleteModal; 