import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "./LanguageContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { fonts, selectedFont, selectFont } = useContext(FontContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { changeLanguage, translations, language } = useLanguage();
  const [modalLangVisible, setModalLangVisible] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [contributorsModalVisible, setContributorsModalVisible] = useState(false);

  const openGitHub = () => {
    Linking.openURL("https://github.com/Bhavukverma17/nNotes");
  };
  const openPlayStore = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.bhavukverma.nNotes"
    );
  };

  // Load notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem("notes");
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      Alert.alert("Error", "Failed to load notes");
      return [];
    }
  };

  // Save notes to AsyncStorage
  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      Alert.alert("Error", "Failed to save notes");
    }
  };

  // Export Notes Handler
  const handleExportNotes = async () => {
    try {
      const notes = await loadNotes();
      if (notes.length === 0) {
        Alert.alert("Info", "No notes available to export.");
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}nNotes_backup.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(notes, null, 2));
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export Notes",
        UTI: "public.json",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to export notes: " + error.message);
    }
  };

  // Import Notes Handler with DocumentPicker
  const handleImportNotes = async () => {
    try {
      // Open document picker to select a JSON file
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json", // Restrict to JSON files
        copyToCacheDirectory: true, // Copies file to app's cache for easier access
      });

      // Check if the user cancelled the picker
      if (result.canceled) {
        return;
      }

      // Extract the URI from the result (handle new Expo structure)
      const fileUri = result.assets && result.assets[0] ? result.assets[0].uri : null;

      // Validate that we have a valid URI
      if (!fileUri) {
        Alert.alert("Error", "Failed to retrieve file URI. Please try again.");
        return;
      }

      // Read the selected file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const importedNotes = JSON.parse(fileContent);

      // Validate that the imported data is an array
      if (!Array.isArray(importedNotes)) {
        Alert.alert("Error", "Invalid notes format in the file. Please select a valid JSON file.");
        return;
      }

      // Merge imported notes with existing notes, avoiding duplicates
      const currentNotes = await loadNotes();
      const mergedNotes = [
        ...currentNotes,
        ...importedNotes.filter((note) =>
          !currentNotes.some((existing) => existing.id === note.id)
        ),
      ];

      // Save the merged notes
      await saveNotes(mergedNotes);
      Alert.alert("Success", "Notes imported successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to import notes: " + error.message);
    }
  };

  // Clear All Notes Handler
  const handleClearNotes = async () => {
    try {
      await AsyncStorage.removeItem("notes");
      setClearModalVisible(false);
      Alert.alert("Success", "All notes have been cleared!");
    } catch (error) {
      Alert.alert("Error", "Failed to clear notes: " + error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? "black" : "white" }]}>
      <View
        style={[
          styles.scontainer,
          { backgroundColor: isDarkMode ? "black" : "white" },
        ]}
      >
        <View style={styles.headingBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign
              name="arrowleft"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode ? "white" : "black",
                fontFamily: selectedFont === "Ntype" ? undefined : selectedFont,
                fontSize: 28,
              },
            ]}
          >
            {translations.AppSettings}
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/* ITEM 1 Style 3.0 - START */}
          <View style={styles.itemTitle}>
            <Text
              style={[
                styles.itemTitleText,
                { color: isDarkMode ? "white" : "black", fontSize: 16 },
              ]}
            >
              {translations.Theme}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.itemWrapperndot,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black" },
                ]}
              >
                {translations.Header} Font
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161" },
                ]}
              >
                {translations.itext1}
              </Text>
            </View>
            <View style={styles.ndotarrowThin}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.85)"
                    : "rgba(255, 255, 255, 0.83)",
                },
              ]}
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: isDarkMode ? "#141414" : "#f0f0f0" },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? "white" : "black" },
                  ]}
                >
                  Fonts
                </Text>
                <View>
                  {Object.entries(fonts).map(([key, displayName]) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => selectFont(key)}
                      style={{ paddingTop: 15, paddingRight: 20 }}
                    >
                      <Text
                        style={{
                          color: isDarkMode ? "#ADADAD" : "#616161",
                          fontSize: 18,
                          margin: 6,
                        }}
                      >
                        {displayName}{" "}
                        {selectedFont === key && (
                          <AntDesign
                            name="checkcircle"
                            size={14}
                            color="#D71921"
                          />
                        )}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.buttonText, { color: "white" }]}>
                    Save Selection
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.itemWrapperThin,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black" },
                ]}
              >
                {translations.Colortheme}
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161"},
                ]}
              >
                {translations.itext2}
              </Text>
            </View>
            <View style={styles.themeIcon}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 5,
                }}
              />
            </View>
          </TouchableOpacity>

          {/* ITEM 1 Style 3.0 - END */}

          {/* Language Selection Modal */}
          <Modal
            visible={modalLangVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalLangVisible(false)}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.85)"
                    : "rgba(255, 255, 255, 0.83)",
                },
              ]}
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: isDarkMode ? "#141414" : "#f0f0f0" },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? "white" : "black" },
                  ]}
                >
                  Language
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    changeLanguage("en");
                    setModalLangVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    style={[
                      styles.langOption,
                      {
                        color:
                          language === "en"
                            ? "#D71921" // Red for active language
                            : isDarkMode
                            ? "white"
                            : "black",
                      },
                    ]}
                  >
                    1. English (Default)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    changeLanguage("jp");
                    setModalLangVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    style={[
                      styles.langOption,
                      {
                        color:
                          language === "jp"
                            ? "#D71921" // Red for active language
                            : isDarkMode
                            ? "white"
                            : "black",
                      },
                    ]}
                  >
                    2. 日本語 (Japanese)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    changeLanguage("de");
                    setModalLangVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    style={[
                      styles.langOption,
                      {
                        color:
                          language === "de"
                            ? "#D71921" // Red for active language
                            : isDarkMode
                            ? "white"
                            : "black",
                      },
                    ]}
                  >
                    3. Deutsch (German)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* DATA SECTION - START */}
          <View style={styles.itemTitle}>
            <Text
              style={[
                styles.itemTitleText,
                { color: isDarkMode ? "white" : "black", fontSize: 16 },
              ]}
            >
              {translations.Data || "Data"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleExportNotes}
            style={[
              styles.itemWrapperndot,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black"},
                ]}
              >
                Export Notes
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161" },
                ]}
              >
                Save your notes to a file
              </Text>
            </View>
            <View style={styles.ndotarrowThin}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleImportNotes}
            style={[
              styles.itemWrapperMid,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black" },
                ]}
              >
                Import Notes
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161" },
                ]}
              >
                Load notes from a JSON file
              </Text>
            </View>
            <View style={styles.ndotarrow}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setClearModalVisible(true)}
            style={[
              styles.itemWrapperThin,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black"},
                ]}
              >
                Clear All Notes
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161" },
                ]}
              >
                Delete all notes permanently
              </Text>
            </View>
            <View style={styles.ndotarrowThin}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <Modal
            visible={clearModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setClearModalVisible(false)}
          >
            <View style={styles.overlay}>
              <View
                style={[
                  styles.dmodalContainer,
                  { backgroundColor: isDarkMode ? "#141414" : "white" },
                ]}
              >
                <Text style={styles.dmodalTitle}>Clear All Notes</Text>
                <Text
                  style={[
                    styles.dmodalMessage,
                    { color: isDarkMode ? "#fff" : "black" },
                  ]}
                >
                  Are you sure you want to delete all notes? This action cannot
                  be undone.
                </Text>

                <View style={styles.dmodalButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.dcancelButton]}
                    onPress={() => setClearModalVisible(false)}
                  >
                    <Text style={styles.dbuttonText}>
                      {translations.Cancel}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.ddeleteButton]}
                    onPress={handleClearNotes}
                  >
                    <Text style={styles.dbuttonText}>{translations.Del}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* DATA SECTION - END */}

          {/* ITEM 2 Style 3.0 - START */}
          <View style={styles.itemTitle}>
            <Text
              style={[
                styles.itemTitleText,
                { color: isDarkMode ? "white" : "black", fontSize: 16 },
              ]}
            >
              {translations.About}
            </Text>
          </View>

          <TouchableOpacity
            onPress={openGitHub}
            style={[
              styles.itemWrapperndot,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black"},
                ]}
              >
                {translations.Github}
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161" },
                ]}
              >
                {translations.GMess}
              </Text>
            </View>
            <View style={styles.ndotarrowThin}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalLangVisible(true)}
            style={[
              styles.itemWrapperMid,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black" },
                ]}
              >
                Change Language
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161"},
                ]}
              >
                Change the Language of App.
              </Text>
            </View>
            <View style={styles.ndotarrow}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setContributorsModalVisible(true)}
            style={[
              styles.itemWrapperMid,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black"},
                ]}
              >
                Contributors
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161"},
                ]}
              >
                View app contributors
              </Text>
            </View>
            <View style={styles.ndotarrow}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openPlayStore}
            style={[
              styles.itemWrapperThin,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black" },
                ]}
              >
                App {translations.Version}
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161" },
                ]}
              >
                V1.6.1 Stable
              </Text>
            </View>
            <View style={styles.ndotarrowThin}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: 25,
                  fontFamily: "ndot",
                  paddingLeft: 20,
                }}
              >
                {">"}
              </Text>
            </View>
          </TouchableOpacity>
          {/* ITEM 2 Style 3.0 - END */}

          {/* Contributors Modal */}
          <Modal
            visible={contributorsModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setContributorsModalVisible(false)}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.85)"
                    : "rgba(255, 255, 255, 0.83)",
                },
              ]}
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: isDarkMode ? "#141414" : "#f0f0f0" },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? "white" : "black" },
                  ]}
                >
                  Contributors
                </Text>
                <View style={styles.contributorItem}>
                  <Text
                    style={[
                      styles.contributorTitle,
                      { color: isDarkMode ? "white" : "black" },
                    ]}
                  >
                    App Developer
                  </Text>
                  <View style={styles.contributorContent}>
                    <Text
                      style={[
                        styles.contributorText,
                        { color: isDarkMode ? "#ADADAD" : "#616161" },
                      ]}
                    >
                      Bhavuk verma
                    </Text>
                    <AntDesign name="heart" size={20} color="#d71921" />
                  </View>
                </View>
                <View style={styles.contributorItem}>
                  <Text
                    style={[
                      styles.contributorTitle,
                      { color: isDarkMode ? "white" : "black" },
                    ]}
                  >
                    App Icon
                  </Text>
                  <View style={styles.contributorContent}>
                    <Text
                      style={[
                        styles.contributorText,
                        { color: isDarkMode ? "#ADADAD" : "#616161" },
                      ]}
                    >
                      Lee seth - 13 galaxy
                    </Text>
                    <AntDesign name="youtube" size={20} color="#d71921" />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setContributorsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.buttonText, { color: "white" }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
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
    paddingHorizontal: 10,
  },
  headingBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    color: "white",
    paddingLeft: 15,
    marginBottom: 3,
    width: 300,
  },
  itemTitle: {
    marginTop: 20,
    paddingVertical: 10,
    width: "100%",
    alignItems: "left",
    justifyContent: "center",
    paddingLeft: 30,
  },
  itemTitleText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    height: 104,
    paddingLeft: 22,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  itemWrapperndot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 22,
    marginHorizontal: 20,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginBottom: 3,
  },
  itemWrapperThin1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    height: 85,
    paddingLeft: 22,
    marginHorizontal: 20,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginBottom: 3,
  },
  itemWrapperThin: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    paddingLeft: 22,
    marginHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  itemHeadText: {
    fontWeight: "600",
    fontSize: 17,
  },
  itemContentText: {
    fontSize: 15,
  },
  ndotarrow: {
    width: 30,
    height: 40,
    marginRight: 20,
  },
  ndotarrowThin: {
    width: 30,
    height: 40,
    marginRight: 20,
  },
  itemCont: {
    flexDirection: "column",
    paddingVertical: 15,
    width: "80%",
  },
  itemContf: {
    flexDirection: "column",
    paddingVertical: 15,
    width: "100%",
  },
  langOption: {
    fontSize: 18,
    margin: 6,
  },
  itemWrapperMid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 22,
    marginHorizontal: 20,
    marginBottom: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.23)", // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 35,
    marginBottom: 10,
    fontFamily: "ntype",
  },
  closeButton: {
    backgroundColor: "#d71921",
    padding: 8,
    borderRadius: 45,
    marginTop: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    margin: 6,
    fontWeight: "bold",
  },
  backButton: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  themeIcon: {
    width: 30,
    height: 40,
    marginRight: 15,
    justifyContent: "center",
  },
  option: {
    paddingVertical: 10,
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
    borderRadius: 26,
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
  contributorItem: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  contributorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  contributorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contributorText: {
    fontSize: 16,
  },
});