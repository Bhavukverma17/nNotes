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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular as inter,
  
} from '@expo-google-fonts/inter';
import { Cutive_400Regular as cutive } from "@expo-google-fonts/cutive";

export default function Home() {
  let [fontsLoaded] = useFonts({
    inter,
    cutive,
  });
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

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    StatusBar.setBackgroundColor(isDarkMode ? "black" : "white");
    loadNotes();
  }, [isDarkMode]);

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
            setNotes(updatedNotes); // Update the notes state
            saveNotes(updatedNotes); // Save updated notes to AsyncStorage
  };

  const handleSaveNote = () => {
    // if (!newTitle.trim()) {
    //   Alert.alert(
    //     "You Can Not Save an Empty Note ! Write Something in Title and Notes"
    //   );
    //   return;
    // }

    if (currentNote) {
      const updatedNotes = notes.map((note) =>
        note.id === currentNote.id
          ? {
              ...note,
              title: newTitle,
              content: newContent,
              image: selectedImage,
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
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    }
    setModalVisible(false);
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

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
    setSearchQuery("");
  };

  // Open full image on pressing img preview jgadment
  const [isFullImageModalVisible, setIsFullImageModalVisible] = useState(false);
  const handleImagePress = () => {
    setIsFullImageModalVisible(true); // Show the full image modal
  };
  const handleSortNotes = () => {
    const reversedNotes = [...notes].reverse(); // Reverse the notes
    setNotes(reversedNotes); // Update the state with reversed notes
    saveNotes(reversedNotes); // Save the reversed notes to AsyncStorage
  };
  const handleModalClose = () => {
    if (newTitle || newContent || selectedImage) {
      handleSaveNote();
    } else {
      setModalVisible(false);
    }
  };
  const { isCustomFont } = useContext(FontContext);
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
            placeholder="Search here..."
            placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          />
        ) : (
          <View style={styles.headerContent}>
            <Text
              style={[
                styles.headerText,
                {
                  fontFamily: isCustomFont ? "ndot" : "cutive",
                  color: isDarkMode ? "white" : "black",
                },
              ]}
            >
              Notes
            </Text>
            <TouchableOpacity
              style={styles.darklightButton}
              onPress={toggleTheme}
            >
              <MaterialIcons
                name={isDarkMode ? "light-mode" : "dark-mode"}
                size={29}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <AntDesign
                name="setting"
                size={24}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        )}

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
                No Notes, tap on + icon to start
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
                    <Text style={styles.deleteSwipeText}>Delete</Text>
                  </TouchableOpacity>
                )}
              >
                <TouchableOpacity
                  style={[
                    styles.noteSmall,
                    { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
                  ]}
                  onPress={() => {
                    setCurrentNote(note);
                    setNewTitle(note.title);
                    setNewContent(note.content);
                    setSelectedImage(note.image || null);
                    setModalVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.noteTitle,
                      { color: isDarkMode ? "white" : "black" },
                    ]}
                  >
                    {note.title}
                  </Text>
                  {note.image && (
                    <Image
                      source={{ uri: note.image }}
                      style={styles.noteImage}
                    />
                  )}
                  <Text
                    style={[
                      styles.noteContent,
                      { color: isDarkMode ? "white" : "black" },
                    ]}
                    numberOfLines={expandedNoteId === note.id ? null : 4}
                  >
                    {note.content}
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
              name="swap"
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

        {/* Delete Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={[styles.dmodalContainer, { backgroundColor: isDarkMode ? "#141414" : "white" },]}>
              <Text style={styles.dmodalTitle}>Delete Note</Text>
              <Text style={[styles.dmodalMessage, { color: isDarkMode ? "#fff" : "black" }]}>
                Are you sure you want to delete this note? This action cannot be
                undone.
              </Text>

              <View style={styles.dmodalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.dcancelButton]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.dbuttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.ddeleteButton]}
                  onPress={() => {
                    handleDeleteNote(noteIdToDelete);
                    setDeleteModalVisible(false);
                  }}
                >
                  <Text style={styles.dbuttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
 
        {/* Note Making Modal */}

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
                  style={styles.notesBack}
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
                        fontFamily: isCustomFont ? "ndot" : "cutive",
                      },
                    ]}
                  >
                    Add Note
                  </Text>
                </View>

                {/* SAVE ICON IN NOTE MAKING */}
                <TouchableOpacity
                  onPress={handleSaveNote}
                  style={styles.notesSave}
                >
                  <AntDesign
                    name="staro"
                    size={24}
                    color={isDarkMode ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[
                  styles.inputTitle,
                  {
                    backgroundColor: isDarkMode ? "#000" : "#fff",
                    color: isDarkMode ? "white" : "black",
                  },
                ]}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Title"
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode ? "#000" : "#fff",
                    color: isDarkMode ? "white" : "black",
                  },
                ]}
                multiline
                value={newContent}
                onChangeText={setNewContent}
                placeholder="Note"
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
              />
              {/* Image Preview with TouchableOpacity */}
              {selectedImage && (
                <TouchableOpacity onPress={handleImagePress}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.imagePreview}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={pickImage}
                style={[
                  styles.imageButton,
                  { backgroundColor: isDarkMode ? "#d71921" : "#d71921" },
                ]}
              >
                <AntDesign
                  name="picture"
                  size={30}
                  color="white"
                  style={styles.addimage}
                />
              </TouchableOpacity>
              {selectedImage && (
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  style={[
                    styles.removeImageButton,
                    { backgroundColor: isDarkMode ? "#555" : "#e74c3c" },
                  ]}
                >
                  <Text style={styles.removeImageButtonText}>Remove Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
        {/* Full Image Modal */}
        <Modal
          visible={isFullImageModalVisible}
          animationType="fade"
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
            onPress={() => setIsFullImageModalVisible(false)} // Close modal when tapping outside image
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
    fontSize: 30,
    color: "black",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    color: "black",
    fontSize: 16,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  noteSmall: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 18,
  },
  noteTitle: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 17,
    fontFamily: 'inter',
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
    left: 35,
    right: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
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
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 16,
    padding: 10,
    marginTop: 15,
    paddingLeft: 15,
  },
  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    fontSize: 16,
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    height: "88%",
    textAlignVertical: "top",
    paddingLeft: 15,
    paddingRight: 15,
  },
  searchInput: {
    fontSize: 20,
    paddingHorizontal: 15,
    textAlign: "center",
    marginBottom: 10,
    borderRadius: 30,
    width: "92%",
    alignSelf: "center",
    height: 50,
  },
  addimage: {
    color: "white",
    fontWeight: "bold",
    paddingVertical: 15,
    textAlign: "center",
  },
  imagePreviewContainer: {
    marginBottom: 10,
  },
  imagePreview: {
    width: 65,
    height: 100,
    borderRadius: 8,
    bottom: 127,
    left: 10,
  },
  removeImageButtonText: {
    color: "white",
    fontWeight: "bold",
    paddingVertical: 14,
    textAlign: "center",
    fontSize: 12,
  },
  imageButton: {
    position: "absolute",
    bottom: 15,
    right: 28,
    backgroundColor: "#d71921",
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    width: 60,
  },
  removeImageButton: {
    position: "absolute",
    bottom: 15,
    right: 28,
    backgroundColor: "#e74c3c",
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    width: 60,
  },
  // Styles for the full image modal
  fullImageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain", // Ehe Haiga - To Ensure the image is properly scaled
    borderRadius: 8,
  },
  addNoteView: {
    width: "50%",
    height: 40,
  },
  addNoteTxt: {
    fontSize: 24,
    color: "white",
    alignSelf: 'center',
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
  },
  settingsButton: {
    padding: 5,
    marginBottom: 5,
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
    marginBottom: 5,
    marginLeft: "45%",
  },
  deleteSwipeText: {
    color: "white",
  },
 overlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
},
dmodalContainer: {
  width: '80%',
  backgroundColor: '#141414',
  borderRadius: 18,
  padding: 20,
  alignItems: 'center',
},
dmodalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#d71921',
},
dmodalMessage: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
},
dmodalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
button: {
  flex: 1,
  marginHorizontal: 5,
  paddingVertical: 10,
  borderRadius: 20,
  alignItems: 'center',
},
dcancelButton: {
  backgroundColor: '#3c3c3c',
},
ddeleteButton: {
  backgroundColor: '#d71921',
},
dbuttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});

