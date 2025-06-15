import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryManager = ({ visible, onClose, isDarkMode, onCategoriesUpdate }) => {
  const [categories, setCategories] = useState(['All', 'Personal']);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('customCategories');
      if (savedCategories) {
        const customCategories = JSON.parse(savedCategories);
        setCategories(['All', 'Personal', ...customCategories]);
      } else {
        setCategories(['All', 'Personal']);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const saveCategories = async (updatedCategories) => {
    try {
      // Filter out 'All' and 'Personal' as they are our default categories
      const customCategories = updatedCategories.filter(cat => cat !== 'All' && cat !== 'Personal');
      await AsyncStorage.setItem('customCategories', JSON.stringify(customCategories));
      setCategories(updatedCategories);
      onCategoriesUpdate(updatedCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    saveCategories(updatedCategories);
    setNewCategory('');
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (categoryToDelete === 'All' || categoryToDelete === 'Personal') {
      Alert.alert('Error', 'Cannot delete default categories');
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${categoryToDelete}"? Notes in this category will be moved to Personal.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
            saveCategories(updatedCategories);
          },
        },
      ]
    );
  };

  const isDefaultCategory = (category) => {
    return category === 'All' || category === 'Personal';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1c1c1c' : '#fff' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
              Manage Categories
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons
                name="close"
                size={24}
                color={isDarkMode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
                  color: isDarkMode ? '#fff' : '#000',
                },
              ]}
              placeholder="New category name"
              placeholderTextColor={isDarkMode ? '#888' : '#666'}
              value={newCategory}
              onChangeText={setNewCategory}
              onSubmitEditing={handleAddCategory}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: '#d71921' }]}
              onPress={handleAddCategory}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.categoriesList}>
            {categories.map((category) => (
              <View
                key={category}
                style={[
                  styles.categoryItem,
                  { borderBottomColor: isDarkMode ? '#333' : '#eee' },
                ]}
              >
                <View style={styles.categoryTextContainer}>
                  <Text style={[styles.categoryText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    {category}
                  </Text>
                  {isDefaultCategory(category) && (
                    <Text style={[styles.defaultBadge, { color: isDarkMode ? '#888' : '#666' }]}>
                      Default
                    </Text>
                  )}
                </View>
                {!isDefaultCategory(category) && (
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(category)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={24}
                      color={isDarkMode ? '#ff4444' : '#d71921'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    maxHeight: '70%',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  categoryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    marginRight: 8,
  },
  defaultBadge: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 5,
  },
});

export default CategoryManager; 