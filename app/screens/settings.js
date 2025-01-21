import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontContext } from "../FontContext";
import ThemeContext from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  Inter_400Regular as inter,
  Inter_500Medium as interMedium,
} from "@expo-google-fonts/inter";
import { Cutive_400Regular as cutive } from "@expo-google-fonts/cutive";

export default function Settings() {
  let [fontsLoaded] = useFonts({
    inter,
    cutive,
    interMedium,
  });
  const { isCustomFont, toggleFont } = useContext(FontContext);
  const { isDarkMode } = useContext(ThemeContext);
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
            onPress={() => navigation.navigate("Home")}
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
                fontFamily: isCustomFont ? "ndot" : "cutive",
                fontSize: 22,
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
        <View
          style={[
            styles.itemWrapper,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            NDot Headers
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            Change font Family of Headers to NDot Font
            Default is Inter Font. 
          </Text>
          <Switch style={styles.fontswitch}
              value={isCustomFont}
              onValueChange={toggleFont}
              trackColor={{ false: "#767577", true: "#d17575" }}
              thumbColor={isCustomFont ? "#d71921" : "#f4f3f4"}
            />
        </View>

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
        <TouchableOpacity onPress={openGitHub}
          style={[
            styles.itemWrapper,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            GitHub Repo
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            App is Open source. You can view or contribute to Github repository. 
          </Text>
          <View style={styles.ndotarrow}>
              <Text style={{color: isDarkMode ? "white" : "black", fontSize: 25, fontFamily: "ndot", paddingLeft: 20,}}>
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

        <TouchableOpacity onPress={openX}
          style={[
            styles.itemWrapperThin1,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            FeedBack & Support
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            Report Bugs on X.com
          </Text>
          <View style={styles.ndotarrowThin}>
              <Text style={{color: isDarkMode ? "white" : "black", fontSize: 25, fontFamily: "ndot", paddingLeft: 20,}}>
                {">"}
              </Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={openGithubReleases}
          style={[
            styles.itemWrapperThin,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            Version
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            V1.2.0
          </Text>
          <View style={styles.ndotarrowThin}>
              <Text style={{color: isDarkMode ? "white" : "black", fontSize: 25, fontFamily: "ndot", paddingLeft: 20,}}>
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
    fontWeight: "700",
    marginLeft: 10,
  },
  itemWrapper: {
    backgroundColor: "red",
    height: 104,
    paddingLeft: 22,
    paddingRight: 50,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  itemWrapperThin1: {
    backgroundColor: "red",
    height: 85,
    paddingLeft: 22,
    paddingRight: 50,
    marginHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 3,
  },
  itemWrapperThin: {
    backgroundColor: "red",
    height: 85,
    paddingLeft: 22,
    paddingRight: 50,
    marginHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  itemHeadText: {
    paddingTop: 15,
    fontWeight: '600',
  },
  ndotarrow: {
    position: "absolute",
    right: 20,
    top: 35,
    width: 30,
    height: 40,
  },
  ndotarrowThin: {
    position: "absolute",
    right: 20,
    top: 27,
    width: 30,
    height: 40,
  },
});
