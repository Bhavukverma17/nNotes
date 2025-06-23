import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { useLanguage } from "./LanguageContext";
import { useIsFocused } from "@react-navigation/native";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import DeleteModal from "../components/DeleteModal";
import { CATEGORIES, COLOR_PAIRS, DEFAULT_CATEGORY, DEFAULT_COLOR, SORT_OPTIONS } from "../constants/notes";
import useDebounce from "../hooks/useDebounce";
import CategoryManager from '../components/CategoryManager';

SplashScreen.preventAutoHideAsync();

function Home() {
  let [fontsLoaded] = useFonts({
    ntype: require("../../assets/fonts/NType82-Regular.otf"),
    ndot: require("../../assets/fonts/ndot.ttf"),
    ndotcapi: require("../../assets/fonts/NDot57Caps.otf"),
    interm: require("../../assets/fonts/Inter-Medium.otf"),
    azeret: require("../../assets/fonts/AzeretMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { selectedFont } = useContext(FontContext);
  const { translations } = useLanguage();
  const [noteColor, setNoteColor] = useState(" ");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DATE_DESC);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchQuery = useDebounce(searchInput, 300);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isMasonryLayout, setIsMasonryLayout] = useState(false);
  const isFocused = useIsFocused();
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    StatusBar.setBackgroundColor(isDarkMode ? "black" : "white");
    NavigationBar.setBackgroundColorAsync(isDarkMode ? "black" : "white");
    loadNotes();
    loadCategories();
    loadLayoutPreference();
    loadThemePreference();
  }, [isDarkMode]);

  useEffect(() => {
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedCategory]);

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      Alert.alert("Error", "Failed to save notes");
    }
  };

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('customCategories');
      if (savedCategories) {
        const customCategories = JSON.parse(savedCategories);
        setCategories(['All', ...customCategories]);
      } else {
        setCategories(['All']);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadLayoutPreference = async () => {
    try {
      const savedLayout = await AsyncStorage.getItem('layoutPreference');
      if (savedLayout) {
        setIsMasonryLayout(savedLayout === 'masonry');
      }
    } catch (error) {
      console.error('Error loading layout preference:', error);
    }
  };

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme) {
        toggleTheme();
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const filterNotes = () => {
    let filtered = [...notes];

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    setFilteredNotes(filtered);
  };

  const handleAddNote = () => {
    setCurrentNote(null);
    setNewTitle("");
    setNewContent("");
    setSelectedImage(null);
    setNoteColor("");
    setSelectedCategory('All');
    setModalVisible(true);
  };

  const handleDeleteNote = useCallback((noteId) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }, [notes]);

  const handleSaveNote = useCallback(() => {
    if (currentNote) {
      const updatedNotes = notes.map((note) =>
        note.id === currentNote.id
          ? {
              ...note,
              title: newTitle,
              content: newContent,
              image: selectedImage,
              color: noteColor,
              category: selectedCategory,
            }
          : note
      );
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    } else {
      const newNote = {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        image: selectedImage,
        color: noteColor,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    }
    setModalVisible(false);
  }, [currentNote, notes, newTitle, newContent, selectedImage, noteColor, selectedCategory]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant permission to access your photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = filteredNotes.filter(
      (note) =>
        (note.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) &&
        (selectedCategory === "All" || note.category === selectedCategory)
    );

    switch (sortOption) {
      case SORT_OPTIONS.DATE_DESC:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case SORT_OPTIONS.DATE_ASC:
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case SORT_OPTIONS.TITLE_ASC:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SORT_OPTIONS.TITLE_DESC:
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [filteredNotes, debouncedSearchQuery, selectedCategory, sortOption]);

  const handleLongPress = useCallback((noteId) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedNotes([noteId]);
    } else {
      toggleNoteSelection(noteId);
    }
  }, [isSelecting]);

  const toggleNoteSelection = useCallback((noteId) => {
    setSelectedNotes((prev) => {
      if (prev.includes(noteId)) {
        const newSelected = prev.filter((id) => id !== noteId);
        if (newSelected.length === 0) {
          setIsSelecting(false);
        }
        return newSelected;
      } else {
        return [...prev, noteId];
      }
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNotes.length > 0) {
      setDeleteModalVisible(true);
    }
  }, [selectedNotes]);

  const confirmDeleteSelected = useCallback(() => {
    const updatedNotes = notes.filter(
      (note) => !selectedNotes.includes(note.id)
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setSelectedNotes([]);
    setIsSelecting(false);
    setDeleteModalVisible(false);
  }, [notes, selectedNotes]);

  const handleCancelSelection = useCallback(() => {
    setSelectedNotes([]);
    setIsSelecting(false);
  }, []);

  const renderNote = useCallback(({ item: note }) => (
    <NoteCard
      note={note}
      isDarkMode={isDarkMode}
      onPress={() => {
        if (isSelecting) {
          toggleNoteSelection(note.id);
        } else {
          setCurrentNote(note);
          setNewTitle(note.title);
          setNewContent(note.content);
          setSelectedImage(note.image || null);
          setNoteColor(note.color || "");
          setSelectedCategory(note.category || 'All');
          setModalVisible(true);
        }
      }}
      onLongPress={() => handleLongPress(note.id)}
      isSelected={selectedNotes.includes(note.id)}
      selectedFont={selectedFont}
    />
  ), [isDarkMode, isSelecting, selectedNotes, notes, selectedFont]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text
        style={[
          styles.emptyStateText,
          { color: isDarkMode ? "#888" : "#888" },
        ]}
      >
        {translations.NoNotes}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? "black" : "white" }]}>
      <View
        style={[
          styles.scontainer,
          { backgroundColor: isDarkMode ? "black" : "white" },
        ]}
      >
        {isSearching ? (
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            onChangeText={setSearchInput}
            placeholder={translations.SearchHere}
            placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
            accessible={true}
            accessibilityLabel="Search notes"
          />
        ) : (
          <View style={styles.headerContent}>
            <Text
              style={[
                styles.headerText,
                {
                  fontFamily:
                    selectedFont === "Ntype" ? undefined : selectedFont,
                  color: isDarkMode ? "white" : "black",
                },
              ]}
            >
              {translations.Notes}
            </Text>
            <View style={styles.twoContainer}>
              {isSelecting && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteSelected}
                  accessible={true}
                  accessibilityLabel="Delete selected notes"
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color={isDarkMode ? "white" : "black"}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => {
                  if (isSelecting) {
                    handleCancelSelection();
                  } else {
                    navigation.navigate("Settings");
                  }
                }}
                accessible={true}
                accessibilityLabel={isSelecting ? "Cancel selection" : "Open settings"}
              >
                <Ionicons
                  name={isSelecting ? "close-circle" : "settings-outline"}
                  size={24}
                  color={isDarkMode ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === cat ? '#d71921' : isDarkMode ? '#333' : '#f5f5f5',
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: selectedCategory === cat ? '#fff' : isDarkMode ? '#fff' : '#000' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' },
              ]}
              onPress={() => setShowCategoryManager(true)}
            >
              <MaterialIcons
                name="settings"
                size={20}
                color={isDarkMode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <FlatList
          data={filteredAndSortedNotes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.notescontain,
            { backgroundColor: isDarkMode ? "#000" : "#fff" },
            { paddingBottom: 100 },
          ]}
          ListEmptyComponent={renderEmptyState}
          onRefresh={loadNotes}
          refreshing={isLoading}
        />

        <View
          style={[
            styles.bottomNav,
            { backgroundColor: isDarkMode ? "#262626" : "#fff" },
          ]}
        >
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              const options = Object.values(SORT_OPTIONS);
              const currentIndex = options.indexOf(sortOption);
              const nextIndex = (currentIndex + 1) % options.length;
              setSortOption(options[nextIndex]);
            }}
            accessible={true}
            accessibilityLabel="Change sort order"
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleAddNote}
            accessible={true}
            accessibilityLabel="Add new note"
          >
            <AntDesign
              name="plus"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, isSearching && styles.navButtonActive]}
            onPress={() => {
              setIsSearching((prev) => !prev);
              setSearchInput("");
            }}
            accessible={true}
            accessibilityLabel={isSearching ? "Exit search" : "Search notes"}
          >
            <AntDesign
              name="search1"
              size={24}
              color={isSearching ? "#d71921" : isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>

        <NoteModal
          visible={modalVisible}
          onClose={() => {
            if (newTitle || newContent || selectedImage) {
              handleSaveNote();
            } else {
              setModalVisible(false);
            }
          }}
          currentNote={currentNote}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newContent={newContent}
          setNewContent={setNewContent}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          noteColor={noteColor}
          setNoteColor={setNoteColor}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isDarkMode={isDarkMode}
          selectedFont={selectedFont}
          onSave={handleSaveNote}
          onImagePick={pickImage}
        />

        <DeleteModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={confirmDeleteSelected}
          selectedCount={selectedNotes.length}
          isDarkMode={isDarkMode}
          translations={translations}
        />

        <CategoryManager
          visible={showCategoryManager}
          onClose={() => setShowCategoryManager(false)}
          isDarkMode={isDarkMode}
          onCategoriesUpdate={(updatedCategories) => {
            setCategories(updatedCategories);
            if (!updatedCategories.includes(selectedCategory)) {
              setSelectedCategory('All');
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scontainer: {
    flex: 1,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 38,
    color: "black",
    flex: 2,
    paddingLeft: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 45,
    position: "absolute",
    bottom: 16,
    left: 50,
    right: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 50,
    borderRadius: 15,
  },
  navButtonActive: {
    backgroundColor: "#f5f5f520",
    borderRadius: 40,
  },
  searchInput: {
    fontSize: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 30,
    width: "92%",
    alignSelf: "center",
    height: 50,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  settingsButton: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // marginTop: 200,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
  },
  deleteButton: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  twoContainer: {
    flexDirection: "row",
  },
  filterContainer: {
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  notescontain: {
    flexGrow: 1,
  },
});

export default Home;
