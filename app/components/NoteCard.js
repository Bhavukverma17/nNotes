import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLOR_PAIRS } from '../constants/notes';

const NoteCard = ({
  note,
  isDarkMode,
  onPress,
  onLongPress,
  onPinPress,
  isSelected,
  selectedFont,
}) => {
  const backgroundColor = note.color && COLOR_PAIRS[note.color]
    ? COLOR_PAIRS[note.color][isDarkMode ? "dark" : "light"]
    : isDarkMode
    ? "#1c1c1c"
    : "#f0f0f0";

  return (
    <TouchableOpacity
      style={[
        styles.noteSmall,
        { backgroundColor },
        isSelected && styles.selectedNote,
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Note: ${note.title}`}
      accessibilityRole="button"
    >
      {note.image && (
        <Image
          source={{ uri: note.image }}
          style={styles.noteImage}
          accessible={true}
          accessibilityLabel="Note image"
        />
      )}
      <View style={styles.noteHeader}>
        <Text
          style={[
            styles.noteTitle,
            { color: isDarkMode ? "white" : "black" },
            { fontFamily: selectedFont === "Ntype" ? undefined : selectedFont },
          ]}
        >
          {note.title}
        </Text>
        <View style={styles.noteHeaderRight}>

        <View style={styles.noteCategoryContainer}>
        <Text
        style={[
          styles.noteCategory,
          { color: "white" },
        ]}
      >
        {note.category || "Personal"}
      </Text>
      </View>
        <TouchableOpacity
          onPress={onPinPress}
          style={styles.pinButton}
          accessible={true}
          accessibilityLabel={note.pinned ? "Unpin note" : "Pin note"}
        >
          <AntDesign
            name={note.pinned ? "pushpin" : "pushpino"}
            size={20}
            color={
              note.pinned
                ? isDarkMode
                  ? "white"
                  : "black"
                : isDarkMode
                ? "white"
                : "#4a4a4a"
            }
          />
        </TouchableOpacity>
        </View>
      </View>
           
      

      <Text
        style={[
          styles.noteContent,
          { color: isDarkMode ? "#d9d9d9" : "#4a4a4a" },
        ]}
        numberOfLines={4}
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
  );
};

const styles = StyleSheet.create({
  noteSmall: {
    borderRadius: 25,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  noteTitle: {
    fontSize: 20,
    fontFamily: "interm",
  },
  noteContent: {
    fontSize: 15,
    fontFamily: "interm",
  },
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 7,
    marginTop: 1,
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
  noteCategory: {
    fontSize: 12,
    fontFamily: "ndotcapi",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
    fontFamily: "ndotcapi",
  },
  selectedNote: {
    borderWidth: 2,
    borderColor: "#d71921",
  },
  noteCategoryContainer: {
    backgroundColor: "#1c19d7",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#7370ff",
  },
  noteHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default NoteCard; 