import React, { useState, useEffect, useContext } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { useLanguage } from "./LanguageContext";
import { Share } from "react-native";
import { useIsFocused } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

function Home() {
  let [fontsLoaded] = useFonts({
    ntype: require("../../assets/fonts/NType82-Regular.otf"),
    ndot: require("../../assets/fonts/ndot.ttf"),
    ndotcapi: require("../../assets/fonts/NDot57Caps.otf"),
    interm: require("../../assets/fonts/Inter-Medium.otf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [expandedNoteId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const { selectedFont } = useContext(FontContext);
  const { translations } = useLanguage();
  const [noteColor, setNoteColor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const isFocused = useIsFocused();

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    StatusBar.setBackgroundColor(isDarkMode ? "black" : "white");
    NavigationBar.setBackgroundColorAsync(isDarkMode ? "black" : "transparent");
    loadNotes();
  }, [isDarkMode]);
  useEffect(() => {
    if (isFocused) {
      loadNotes(); // Reload notes when screen is focused
    }
  }, [isFocused]);

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      Alert.alert("Error", "Failed to save notes");
    }
  };

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load notes");
    }
  };

  const handleAddNote = () => {
    setCurrentNote(null);
    setNewTitle("");
    setNewContent("");
    setSelectedImage(null);
    setModalVisible(true);
  };
  function handleDeletePress(noteId) {
    setNoteIdToDelete(noteId);
    setDeleteModalVisible(true);
  }

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleSaveNote = () => {
    if (currentNote) {
      const updatedNotes = notes.map((note) =>
        note.id === currentNote.id
          ? {
              ...note,
              title: newTitle,
              content: newContent,
              image: selectedImage,
              color: noteColor || "neutral",
              pinned: note.pinned || false,
              category: selectedCategory || "Uncategorized",
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
        color: noteColor || "neutral",
        pinned: false,
        category: selectedCategory || "Uncategorized",
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    }
    setModalVisible(false);
    setNoteColor(null);
    setSelectedCategory(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterCategory === "All" || note.category === filterCategory)
    )
    .sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));

  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
    setSearchQuery("");
  };

  const [isFullImageModalVisible, setIsFullImageModalVisible] = useState(false);
  const handleImagePress = () => {
    setIsFullImageModalVisible(true);
  };
  const handleSortNotes = () => {
    const reversedNotes = [...notes].reverse();
    setNotes(reversedNotes);
    saveNotes(reversedNotes);
  };
  const handleModalClose = () => {
    if (newTitle || newContent || selectedImage) {
      handleSaveNote();
    } else {
      setModalVisible(false);
    }
  };
  const { isCustomFont } = useContext(FontContext);
  const colors = ["#f0f0f0", "#ffcccc", "#cce5ff", "#ccffcc", "#fff3cc"];

  const colorPairs = {
    neutral: { light: "#f0f0f0", dark: "#1c1c1c" },
    red: { light: "#ffcccc", dark: "#4a1a1a" },
    blue: { light: "#cce5ff", dark: "#1a2e4a" },
    green: { light: "#ccffcc", dark: "#1a4a1a" },
    yellow: { light: "#fff3cc", dark: "#4a3e1a" },
  };

  const currentColors = Object.keys(colorPairs).map(
    (key) => colorPairs[key][isDarkMode ? "dark" : "light"]
  );

  return (
    <SafeAreaView style={styles.container}> 
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
                backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={translations.SearchHere}
            placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
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

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.filterContainer}>
          {["All", "Uncategorized", "Work", "Personal", "Ideas"].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setFilterCategory(cat)}
              style={[
                styles.filterButton,
                filterCategory === cat && styles.activeFilterButton,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      filterCategory === cat
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
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.notescontain,
            { backgroundColor: isDarkMode ? "#000" : "#fff" },
            { paddingBottom: 100 },
          ]}
        >
          {filteredNotes.length === 0 ? (
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
          ) : (
            filteredNotes.map((note) => (
              <Swipeable
                key={note.id}
                renderRightActions={() => (
                  <TouchableOpacity
                    style={[
                      styles.deleteSwipeAction,
                      { backgroundColor: isDarkMode ? "#d71921" : "#d71921" },
                    ]}
                    onPress={() => handleDeletePress(note.id)}
                  >
                    <Text style={styles.deleteSwipeText}>
                      {translations.Del}
                    </Text>
                  </TouchableOpacity>
                )}
              >
                <TouchableOpacity
                  style={[
                    styles.noteSmall,
                    {
                      backgroundColor:
                        note.color && colorPairs[note.color]
                          ? colorPairs[note.color][
                              isDarkMode ? "dark" : "light"
                            ]
                          : isDarkMode
                          ? "#1c1c1c"
                          : "#f0f0f0",
                    },
                  ]}
                  onPress={() => {
                    setCurrentNote(note);
                    setNewTitle(note.title);
                    setNewContent(note.content);
                    setSelectedImage(note.image || null);
                    setNoteColor(note.color || "neutral");
                    setSelectedCategory(note.category || "Uncategorized");
                    setModalVisible(true);
                  }}
                >
                  {note.image && (
                    <Image
                      source={{ uri: note.image }}
                      style={styles.noteImage}
                    />
                  )}
                  <View style={styles.noteHeader}>
                    <Text
                      style={[
                        styles.noteTitle,
                        { color: isDarkMode ? "white" : "#4a4a4a" },
                      ]}
                    >
                      {note.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const updatedNotes = notes.map((n) =>
                          n.id === note.id ? { ...n, pinned: !n.pinned } : n
                        );
                        setNotes(updatedNotes);
                        saveNotes(updatedNotes);
                      }}
                      style={styles.pinButton}
                    >
                      <AntDesign
                        name={note.pinned ? "pushpin" : "pushpino"}
                        size={20}
                        color={
                          note.pinned
                            ? "#d71921"
                            : isDarkMode
                            ? "white"
                            : "#4a4a4a"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.noteCategory,
                      { color: isDarkMode ? "#bbb" : "#666" },
                    ]}
                  >
                    {note.category || "Uncategorized"}
                  </Text>

                  <Text
                    style={[
                      styles.noteContent,
                      { color: isDarkMode ? "white" : "black" },
                    ]}
                    numberOfLines={expandedNoteId === note.id ? null : 4}
                  >
                    {note.content}
                  </Text>
                  <Text
                    style={[
                      styles.timestamp,
                      { color: isDarkMode ? "#888" : "#666" },
                    ]}
                  >
                    {new Date(note.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </Swipeable>
            ))
          )}
        </ScrollView>

        <View
          style={[
            styles.bottomNav,
            { backgroundColor: isDarkMode ? "#262626" : "#fff" },
          ]}
        >
          <TouchableOpacity style={styles.navButton} onPress={handleSortNotes}>
            <AntDesign
              name="bars"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleAddNote}>
            <AntDesign
              name="plus"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, isSearching && styles.navButtonActive]}
            onPress={handleSearchToggle}
          >
            <AntDesign
              name="search1"
              size={24}
              color={isSearching ? "#d71921" : isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View
              style={[
                styles.dmodalContainer,
                { backgroundColor: isDarkMode ? "#141414" : "white" },
              ]}
            >
              <Text style={styles.dmodalTitle}>Delete Note</Text>
              <Text
                style={[
                  styles.dmodalMessage,
                  { color: isDarkMode ? "#fff" : "black" },
                ]}
              >
                {translations.DMess}
              </Text>

              <View style={styles.dmodalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.dcancelButton]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.dbuttonText}>{translations.Cancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.ddeleteButton]}
                  onPress={() => {
                    handleDeleteNote(noteIdToDelete);
                    setDeleteModalVisible(false);
                  }}
                >
                  <Text style={styles.dbuttonText}>{translations.Del}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleModalClose}
        >
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(255, 255, 255, 0.8)",
              },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: isDarkMode ? "#000000" : "#ffffff" },
              ]}
            >
              <View style={styles.modalTopRow}>
                <TouchableOpacity
                  style={styles.notesActnBtn}
                  onPress={handleModalClose}
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
                        fontFamily:
                          selectedFont === "Ntype" ? undefined : selectedFont,
                      },
                    ]}
                  >
                    {translations.AddNote}
                  </Text>
                </View>
                <View style={styles.ImgShr}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.notesActnBtn}
                  >
                    <AntDesign
                      name="picture"
                      size={24}
                      color={isDarkMode ? "white" : "black"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.notesActnBtn}
                    onPress={async () => {
                      try {
                        const noteText = `${newTitle}\n\n${newContent}`;
                        await Share.share({
                          message: noteText,
                          title: newTitle,
                        });
                      } catch (error) {
                        Alert.alert("Error", "Failed to share note");
                      }
                    }}
                  >
                    <AntDesign
                      name="sharealt"
                      size={22}
                      color={isDarkMode ? "white" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.categoryPicker}>
                {["Uncategorized", "Work", "Personal", "Ideas"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      selectedCategory === cat && styles.selectedCategoryOption,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isDarkMode ? "white" : "black" },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.colorPicker}>
                {Object.keys(colorPairs).map((key, index) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.colorOption,
                      { backgroundColor: currentColors[index] },
                      noteColor === key && styles.selectedColorOption,
                    ]}
                    onPress={() => setNoteColor(key)}
                  />
                ))}
              </View>
              <TextInput
                style={[
                  styles.inputTitle,
                  {
                    backgroundColor: isDarkMode ? "#000" : "#fff",
                    color: isDarkMode ? "white" : "#4a4a4a",
                  },
                ]}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder={translations.Title}
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      noteColor && colorPairs[noteColor]
                        ? colorPairs[noteColor][isDarkMode ? "dark" : "light"]
                        : isDarkMode
                        ? "#1a1a1a"
                        : "#ededed",
                    color: isDarkMode ? "white" : "black",
                  },
                ]}
                multiline
                value={newContent}
                onChangeText={setNewContent}
                placeholder={translations.Note}
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
              />
              <View style={styles.imagePreviewContainer}>
                {selectedImage && (
                  <TouchableOpacity onPress={handleImagePress}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.imagePreview}
                    />
                  </TouchableOpacity>
                )}
                {selectedImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={[
                      styles.removeImageButton,
                      { backgroundColor: isDarkMode ? "#fff" : "#fff" },
                    ]}
                  >
                    <AntDesign
                      name="close"
                      size={20}
                      color="black"
                      style={styles.removeImageButtonText}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isFullImageModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsFullImageModalVisible(false)}
        >
          <TouchableOpacity
            style={[
              styles.fullImageModalContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(0, 0, 0, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
              },
            ]}
            onPress={() => setIsFullImageModalVisible(false)}
          >
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scontainer: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 20,
  },
  deleteSwipeAction: {
    height: "85%",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  headerText: {
    fontSize: 40,
    color: "black",
    width: "40%",
    paddingLeft: 5,
  },
  noteSmall: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 18,
  },
  noteTitle: {
    color: "black",
    fontWeight: 900,
    marginBottom: 4,
    fontSize: 20,
  },
  noteContent: {
    color: "black",
    fontSize: 15,
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
    left: 40,
    right: 40,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    marginHorizontal: -10,
  },
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 16,
    padding: 20,
  },
  inputTitle: {
    backgroundColor: "#1c1c1c",
    color: "white",
    fontSize: 27,
    fontWeight: 900,
    borderRadius: 16,
    padding: 10,
    paddingLeft: 15,
  },
  input: {
    fontSize: 18,
    borderRadius: 25,
    padding: 1,
    height: "55%",
    textAlignVertical: "top",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    color: "black",
    fontSize: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 30,
    width: "92%",
    alignSelf: "center",
    height: 50,
  },
  imagePreviewContainer: {
    borderRadius: 20,
    height: "20%",
    width: "35%",
    paddingHorizontal: 10,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#616161",
  },
  removeImageButtonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  removeImageButton: {
    bottom: "95%",
    left: 5,
    backgroundColor: "#e74c3c",
    height: 30,
    borderRadius: 100,
    alignItems: "center",
    width: 30,
  },
  fullImageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  addNoteView: {
    width: 130,
    height: 40,
  },
  addNoteTxt: {
    fontSize: 32,
    color: "white",
    width: 200,
    height: 40,
  },
  modalTopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 23,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 18,
    marginBottom: 5,
  },
  settingsButton: {
    marginTop: 6,
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
    marginTop: 250,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
  },
  darklightButton: {
    padding: 5,
    marginBottom: 18,
    marginLeft: "45%",
  },
  deleteSwipeText: {
    color: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  dmodalContainer: {
    width: "80%",
    backgroundColor: "#141414",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  dmodalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d71921",
  },
  dmodalMessage: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dmodalButtons: {
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
  dcancelButton: {
    backgroundColor: "#3c3c3c",
  },
  ddeleteButton: {
    backgroundColor: "#d71921",
  },
  dbuttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 7,
    marginTop: 1,
  },
  notesActnBtn: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  ImgShr: {
    flexDirection: "row",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#888",
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: "#000",
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pinButton: {
    padding: 1,
  },
  categoryPicker: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  categoryOption: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
  },
  selectedCategoryOption: {
    borderColor: "#d71921",
    backgroundColor: "#d7192133",
  },
  categoryText: {
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 2,
    borderRadius: 10,
  },
  activeFilterButton: {
    backgroundColor: "#d71921",
  },
  filterButtonText: {
    fontSize: 14,
  },
  noteCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
});

export default Home;