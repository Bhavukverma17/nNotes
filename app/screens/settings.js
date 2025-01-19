import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontContext } from '../FontContext';
import ThemeContext from '../ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = ({ navigation }) => {
  const { isCustomFont, toggleFont } = useContext(FontContext);
  const { isDarkMode } = useContext(ThemeContext);

  // GitHub URL
  const openGitHub = () => {
    Linking.openURL('https://github.com/Bhavukverma17/nNotes');
  };
  const openX = () => {
    Linking.openURL('https://x.com/bhavukverma17');
  };
  const openGithubReleases = () => {
    Linking.openURL('https://github.com/Bhavukverma17/nNotes/releases');
  };

  return (
      <SafeAreaView style={styles.container}>
        <View
              style={[
                styles.scontainer,
                { backgroundColor: isDarkMode ? 'black' : 'white' },
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
                color={isDarkMode ? 'white' : 'black'}
                style={styles.arrowleft}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                {
                  color: isDarkMode ? 'white' : 'black',
                  fontFamily: isCustomFont ? 'ndot' : 'sans-serif',
                },
              ]}
            >
              Settings
            </Text>
          </View>

          <View style={styles.settingsOptions}>
            {/* 1 ITEM */}
            <View
              style={[
                styles.sitem,
                { backgroundColor: isDarkMode ? '#1c1c1c' : '#f0f0f0' },
              ]}
            >
              <Text
                style={[
                  styles.settingText,
                  { color: isDarkMode ? 'white' : 'black' },
                ]}
              >
                NDot Font (Headers)
              </Text>
              <Switch
                value={isCustomFont}
                onValueChange={toggleFont}
                trackColor={{ false: '#767577', true: '#d17575' }}
                thumbColor={isCustomFont ? '#EF5656' : '#f4f3f4'}
              />
            </View>

        {/* 2 ITEM */}
        <View
          style={[
            styles.sitem,
            { backgroundColor: isDarkMode ? '#1c1c1c' : '#f0f0f0' },
          ]}
        >
          <Text
            style={[
              styles.settingText,
              { color: isDarkMode ? 'white' : 'black' },
            ]}
          >
            GitHub Repo
          </Text>
          <TouchableOpacity style={styles.fwdarrow} onPress={openGitHub}>
            <AntDesign
              name="arrowright"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

        {/* 3 ITEM */}
        <View
          style={[
            styles.sitem,
            { backgroundColor: isDarkMode ? '#1c1c1c' : '#f0f0f0' },
          ]}
        >
          <Text
            style={[
              styles.settingText,
              { color: isDarkMode ? 'white' : 'black' },
            ]}
          >
            Follow on X (Twitter)
          </Text>
          <TouchableOpacity style={styles.fwdarrow} onPress={openX}>
            <AntDesign
              name="arrowright"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

        {/* 4 ITEM */}
        <View
          style={[
            styles.sitem,
            { backgroundColor: isDarkMode ? '#1c1c1c' : '#f0f0f0' },
          ]}
        >
          <Text
            style={[
              styles.settingText,
              { color: isDarkMode ? 'white' : 'black' },
            ]}
          >
            App Updates
          </Text>
          <TouchableOpacity style={styles.fwdarrow} onPress={openGithubReleases} >
            <AntDesign
              name="arrowright"
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

         {/* 5 ITEM */}
         <View
          style={[
            styles.sitem,
            { backgroundColor: isDarkMode ? '#1c1c1c' : '#f0f0f0' },
          ]}
        >
          <Text
            style={[
              styles.settingText,
              { color: isDarkMode ? 'white' : 'black' },
            ]}
          >
            Version
          </Text>
          <Text
            style={[
              styles.versionText,
              { color: isDarkMode ? 'white' : 'black' },
            ]}
          >
            V1.1.0
          </Text>
        </View>

      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scontainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 20,
    paddingLeft: 10,
  },
  headingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {},
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  arrowleft: {
    marginRight: 10,
  },
  settingText: {
    color: 'white',
    fontFamily: 'ndot',
    fontSize: 20,
  },
  versionText: {
      color: 'white',
      fontFamily: 'ndot',
      fontSize: 20,
      marginRight: 10,
  },
  settingsOptions: {
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    height: '90%',
  },
  sitem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#1c1c1c',
    width: '100%',
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 10,
    height: 60,
  },
  fwdarrow: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;
