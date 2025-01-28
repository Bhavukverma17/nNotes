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

export default function Settings() {
  const { isCustomFont, toggleFont } = useContext(FontContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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
                fontFamily: isCustomFont ? "ndot" : "ntype",
                fontSize: 28,
              },
            ]}
          >
            アプリの設定
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
            テーマ
          </Text>
        </View>
        <TouchableOpacity onPress={toggleFont}
          style={[
            styles.itemWrapperndot,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0", },
          ]}
        >
        <View style={styles.itemCont}>
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            NDot のヘッダー
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            ヘッダーのフォントを NDot に変更します。デフォルトのフォントは NType です。 
          </Text>
          </View>
          <View style={styles.ndotarrow}>
              <Text style={{color: isDarkMode ? "white" : "black", fontSize: 25, fontFamily: "ndot", paddingLeft: 20,}}>
                {">"}
              </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTheme}
          style={[
            styles.itemWrapperThin,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <View style={styles.itemCont}>
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            カラーテーマ
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            ライトまたはダークにテーマを変更します。
          </Text>
          </View>
          <View style={styles.ndotarrowThin}>
              <Text style={{color: isDarkMode ? "white" : "black", fontSize: 25, fontFamily: "ndot", paddingLeft: 20,}}>
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
            ソースコード
          </Text>
        </View>
        <TouchableOpacity onPress={openGitHub}
          style={[
            styles.itemWrapper,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <View style={styles.itemCont}>
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            GitHub リポジトリ
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            このアプリはオープンソースです。GitHub リポジトリを閲覧や貢献ができます。
          </Text>
          </View>
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
            アプリについて
          </Text>
        </View>

        <TouchableOpacity onPress={openX}
          style={[
            styles.itemWrapperThin1,
            { backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0" },
          ]}
        >
          <View style={styles.itemCont}>
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            フィードバックとサポート
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            X.com でバグを報告する。
          </Text>
          </View>
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
          <View style={styles.itemCont}>
          <Text
            style={[
              styles.itemHeadText,
              { color: isDarkMode ? "white" : "black", fontSize: 18,
               },
            ]}
          >
            バージョン
          </Text>
          <Text
            style={[
              styles.itemContentText,
              { color: isDarkMode ? "#ADADAD" : "#616161", fontSize: 16,
               },
            ]}
          >
            V1.3.0 Beta
          </Text>
          </View>
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
    // backgroundColor: "red",
    flexDirection: "column",
    paddingVertical: 15,
    width: "80%",
  },
  itemContentText: {
   
  },
});
