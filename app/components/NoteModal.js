import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Share } from 'react-native';
import { Alert } from 'react-native';
import { COLOR_PAIRS, CATEGORIES, DEFAULT_CATEGORY, DEFAULT_COLOR } from '../constants/notes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryManager from './CategoryManager';

const NoteModal = ({
  visible,
  onClose,
  currentNote,
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  selectedImage,
  setSelectedImage,
  noteColor,
  setNoteColor,
  selectedCategory,
  setSelectedCategory,
  isDarkMode,
  selectedFont,
  onSave,
  onImagePick,
  onCategoriesUpdate,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(['All', 'Personal']);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    loadCategories();
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    try {
      const updatedCategories = [...categories, newCategory.trim()];
      const customCategories = updatedCategories.filter(cat => cat !== 'All' && cat !== 'Personal');
      await AsyncStorage.setItem('customCategories', JSON.stringify(customCategories));
      setCategories(updatedCategories);
      setSelectedCategory(newCategory.trim());
      setShowCategoryInput(false);
      setNewCategory('');
      if (onCategoriesUpdate) {
        onCategoriesUpdate(updatedCategories);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const handleCategoryManagerClose = (updatedCategories) => {
    setShowCategoryManager(false);
    if (updatedCategories) {
      setCategories(updatedCategories);
      if (onCategoriesUpdate) {
        onCategoriesUpdate(updatedCategories);
      }
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleShare = async () => {
    try {
      const noteText = `${newTitle}\n\n${newContent}`;
      await Share.share({
        message: noteText,
        title: newTitle,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share note");
    }
  };

  const handleImagePress = () => {
    // Implement full image view
  };

  const currentColors = Object.keys(COLOR_PAIRS).map(
    (key) => COLOR_PAIRS[key][isDarkMode ? "dark" : "light"]
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={handleClose}
      animationType="none"
    >
      <Animated.View 
        style={[
          styles.modalContainer, { backgroundColor: isDarkMode ? "black" : "white" },
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? "#000000" : "#ffffff",
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.modalTopRow}>
              <TouchableOpacity
                style={styles.notesActnBtn}
                onPress={handleClose}
                accessible={true}
                accessibilityLabel="Close modal"
              >
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color={isDarkMode ? "white" : "black"}
                />
              </TouchableOpacity>
              <View style={styles.addNoteView}>
                <Text
                  style={[
                    styles.addNoteTxt,
                    {
                      color: isDarkMode ? "white" : "black",
                      fontFamily: selectedFont === "Ntype" ? undefined : selectedFont,
                    },
                  ]}
                >
                  {currentNote ? "Edit Note" : "Add Note"}
                </Text>
              </View>
              <View style={styles.ImgShr}>
                <TouchableOpacity
                  onPress={onImagePick}
                  style={styles.notesActnBtn}
                  accessible={true}
                  accessibilityLabel="Add image"
                >
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={24}
                    color={isDarkMode ? "white" : "black"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.notesActnBtn}
                  onPress={handleShare}
                  accessible={true}
                  accessibilityLabel="Share note"
                >
                  <MaterialIcons
                    name="share"
                    size={24}
                    color={isDarkMode ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? "white" : "black" }]}>
                  Category
                </Text>
                <View style={styles.categoryContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        selectedCategory === cat && styles.selectedCategoryButton,
                        {
                          backgroundColor: selectedCategory === cat
                            ? "#d71921"
                            : isDarkMode
                            ? "#1a1a1a"
                            : "#f5f5f5",
                        },
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          {
                            color: selectedCategory === cat
                              ? "#ffffff"
                              : isDarkMode
                              ? "#ffffff"
                              : "#000000",
                          },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {!showCategoryInput ? (
                    <TouchableOpacity
                      style={[
                        styles.addCategoryButton,
                        {
                          backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
                        },
                      ]}
                      onPress={() => setShowCategoryInput(true)}
                    >
                      <MaterialIcons
                        name="add"
                        size={24}
                        color={isDarkMode ? "white" : "black"}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.categoryInputContainer}>
                      <TextInput
                        style={[
                          styles.categoryInput,
                          {
                            backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
                            color: isDarkMode ? "white" : "black",
                          },
                        ]}
                        placeholder="New category"
                        placeholderTextColor={isDarkMode ? "#888" : "#666"}
                        value={newCategory}
                        onChangeText={setNewCategory}
                        onSubmitEditing={handleAddCategory}
                      />
                      <TouchableOpacity
                        style={styles.addCategoryConfirmButton}
                        onPress={handleAddCategory}
                      >
                        <MaterialIcons name="check" size={24} color="#d71921" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.addCategoryCancelButton}
                        onPress={() => {
                          setShowCategoryInput(false);
                          setNewCategory('');
                        }}
                      >
                        <MaterialIcons name="close" size={24} color={isDarkMode ? "white" : "black"} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.colorPicker}>
                {Object.keys(COLOR_PAIRS).map((key, index) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.colorOption,
                      { backgroundColor: currentColors[index] },
                      noteColor === key && styles.selectedColorOption,
                    ]}
                    onPress={() => setNoteColor(key)}
                    accessible={true}
                    accessibilityLabel={`Select ${key} color`}
                  />
                ))}
              </View>

              <TextInput
                style={[
                  styles.inputTitle,
                  {
                    color: isDarkMode ? "white" : "black",
                    fontFamily: selectedFont === "Ntype" ? undefined : selectedFont,
                  },
                ]}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Title"
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
                accessible={true}
                accessibilityLabel="Note title"
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      noteColor && COLOR_PAIRS[noteColor]
                        ? COLOR_PAIRS[noteColor][isDarkMode ? "dark" : "light"]
                        : isDarkMode
                        ? "#1a1a1a"
                        : "#ededed",
                    color: isDarkMode ? "white" : "black",
                    fontFamily: selectedFont === "Ntype" ? undefined : selectedFont,
                  },
                ]}
                multiline
                value={newContent}
                onChangeText={setNewContent}
                placeholder="Start writing..."
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
                accessible={true}
                accessibilityLabel="Note content"
              />

              {selectedImage && (
                <View style={styles.imagePreviewContainer}>
                  <TouchableOpacity onPress={handleImagePress}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.imagePreview}
                      accessible={true}
                      accessibilityLabel="Note image preview"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={styles.removeImageButton}
                    accessible={true}
                    accessibilityLabel="Remove image"
                  >
                    <AntDesign
                      name="close"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.statsContainer}>
                <Text style={[
                  styles.statsText,
                  { color: isDarkMode ? "#888" : "#666" }
                ]}>
                  Words: {newContent.split(/\s+/).filter((word) => word.length > 0).length} | 
                  Characters: {newContent.length}
                </Text>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>

      <CategoryManager
        visible={showCategoryManager}
        onClose={handleCategoryManagerClose}
        isDarkMode={isDarkMode}
        onCategoriesUpdate={onCategoriesUpdate}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  modalTopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  addNoteView: {
    flex: 1,
    alignItems: 'center',
  },
  addNoteTxt: {
    fontSize: 24,
    fontWeight: '600',
  },
  notesActnBtn: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  ImgShr: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  inputTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  input: {
    fontSize: 16,
    borderRadius: 15,
    padding: 15,
    minHeight: 200,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#d71921',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addCategoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    minWidth: 120,
  },
  addCategoryConfirmButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCategoryCancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  colorOption: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: "#888",
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: "#d71921",
    transform: [{ scale: 1.1 }],
  },
  statsContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginVertical: 15,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 16/9,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NoteModal; 