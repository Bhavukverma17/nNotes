import React, { useContext, useState } from "react";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "./LanguageContext";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { fonts, selectedFont, selectFont } = useContext(FontContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { fonts, selectedFont, selectFont } = useContext(FontContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { changeLanguage, translations } = useLanguage();
  const [modalLangVisible, setModalLangVisible] = useState(false);

  // GitHub URL
  const openGitHub = () => {
    Linking.openURL("https://github.com/Bhavukverma17/nNotes");
  };
  const openX = () => {
    Linking.openURL("https://x.com/bhavukverma17");
  };
  const openGithubReleases = () => {
    Linking.openURL("https://github.com/Bhavukverma17/nNotes/releases");
  };

  return (
    <SafeAreaView style={styles.container}>
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
              style={styles.arrowleft}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode ? "white" : "black",
                fontFamily: selectedFont === "Ntype" ? undefined : selectedFont,
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
                  { color: isDarkMode ? "white" : "black", fontSize: 18 },
                ]}
              >
                {translations.Header} Font
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
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
                          fontSize: 16,
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

                {/* Button to close the modal */}
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
                  { color: isDarkMode ? "white" : "black", fontSize: 18 },
                ]}
              >
                {translations.Colortheme}
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                {translations.itext2}
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
          </TouchableOpacity>

          {/* ITEM 1 Style 3.0 - END */}
          {/* ITEM 1 Style 3.0 - END */}

      {/* Language Selection Modal */}
      <Modal visible={modalLangVisible} transparent animationType="slide">
        <View style={[
                styles.modalContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.85)"
                    : "rgba(255, 255, 255, 0.83)",
                },
              ]}>
          <View style={[
                  styles.modalContent,
                  { backgroundColor: isDarkMode ? "#141414" : "#f0f0f0" },
                ]}>
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
               <Text style={[
                    styles.langOption,
                    { color: isDarkMode ? "white" : "black" },
                  ]} >1. English (Default)</Text>
             </TouchableOpacity>
             <TouchableOpacity
               onPress={() => {
                 changeLanguage("jp");
                 setModalLangVisible(false);
               }}
               style={styles.option}
             >
               <Text style={[
                    styles.langOption,
                    { color: isDarkMode ? "white" : "black" },
                  ]} >2. 日本語 (Japanese)</Text>
             </TouchableOpacity>
             <TouchableOpacity
               onPress={() => setModalLangVisible(false)}
               style={styles.closeButton}
             >
               <Text style={[styles.buttonText, { color: "white" }]} >Close</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

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
                  { color: isDarkMode ? "white" : "black", fontSize: 18 },
                ]}
              >
                {translations.Github}
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
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
                  { color: isDarkMode ? "white" : "black", fontSize: 18 },
                ]}
              >
                Change Language
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
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
          </TouchableOpacity>


          <TouchableOpacity
            onPress={openGithubReleases}
            style={[
              styles.itemWrapperThin,
              { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
            ]}
          >
            <View style={styles.itemCont}>
              <Text
                style={[
                  styles.itemHeadText,
                  { color: isDarkMode ? "white" : "black", fontSize: 18 },
                ]}
              >
                App {translations.Version}
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                V1.3.3
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
            </View>
          </TouchableOpacity>

          {/* ITEM 2 Style 3.0 - END */}
        </ScrollView>
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
    paddingLeft: 20,
    width: 300,
  },
  arrowleft: {
    marginRight: 10,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 3,
  },
  itemWrapperThin: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    paddingLeft: 22,
    marginHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  itemHeadText: {
    fontWeight: '600',
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
    fontFamily: 'ntype'
  },
  closeButton: {
    backgroundColor: "#d71921",
    padding: 8,
    borderRadius: 45,
    marginTop: 25,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold'
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
    fontSize: 26,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#d71921",
    padding: 10,
    borderRadius: 45,
    marginTop: 20,
    alignItems: 'center'
  },
});
