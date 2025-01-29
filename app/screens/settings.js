import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { fonts, selectedFont, selectFont } = useContext(FontContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
                fontSize: 28,
              },
            ]}
          >
            App Settings
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
              Theme
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}
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
                Headers Font
              </Text>
             <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                Change Font of Headers to NDot. Default Font is Ntype
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
            <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.83)" },]}>
              <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#141414" : "#f0f0f0" },]}>
              <Text
                style={[styles.modalTitle, { color: isDarkMode ? "white" : "black" },]}
              > Fonts </Text>
              <View>
            {Object.entries(fonts).map(([key, displayName]) => (
              <TouchableOpacity
                key={key}
                onPress={() => selectFont(key)}
                style={{ paddingTop: 15, paddingRight: 20, }}
              >
                <Text
                  style={{
                    color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16
                  }}
                >
                  {displayName} {selectedFont === key && <AntDesign name="checkcircle" size={14} color="#D71921" />}
                </Text>
              </TouchableOpacity>
            ))}
            </View>
                
                {/* Button to close the modal */}
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={[styles.buttonText, { color: "white" },]}>Close</Text>
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
                Color Theme
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                Change the Dark/light theme.
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

          {/* ITEM 1 Style 3.0 - END */}

          {/* ITEM 2 Style 3.0 - START */}
          <View style={styles.itemTitle}>
            <Text
              style={[
                styles.itemTitleText,
                { color: isDarkMode ? "white" : "black", fontSize: 16 },
              ]}
            >
              Source Code
            </Text>
          </View>
          <TouchableOpacity
            onPress={openGitHub}
            style={[
              styles.itemWrapper,
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
                GitHub Repo
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                App is Open source. You can view or contribute to Github
                repository.
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

          {/* ITEM 2 Style 3.0 - END */}

          {/* ITEM 3 Style 3.0 - START */}
          <View style={styles.itemTitle}>
            <Text
              style={[
                styles.itemTitleText,
                { color: isDarkMode ? "white" : "black", fontSize: 16 },
              ]}
            >
              About
            </Text>
          </View>

          <TouchableOpacity
            onPress={openX}
            style={[
              styles.itemWrapperThin1,
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
                FeedBack & Support
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                Report Bugs on X.com
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
                Version
              </Text>
              <Text
                style={[
                  styles.itemContentText,
                  { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16 },
                ]}
              >
                V1.3.1
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

          {/* ITEM 3 Style 3.0 - END */}
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
    // backgroundColor: "green",
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
  itemContentText: {
   
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
