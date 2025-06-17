import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR_PAIRS } from '../constants/notes';

const COLOR_NAME_TO_HEX = {
  'red': '#ff0000',
  'green': '#00ff00',
  'blue': '#0000ff',
  'yellow': '#ffff00',
  'purple': '#800080',
  'orange': '#ffa500',
  'pink': '#ffc0cb',
  'brown': '#a52a2a',
  'black': '#000000',
  'white': '#ffffff',
  'gray': '#808080',
  'grey': '#808080',
  'cyan': '#00ffff',
  'magenta': '#ff00ff',
  'lime': '#00ff00',
  'maroon': '#800000',
  'navy': '#000080',
  'olive': '#808000',
  'teal': '#008080',
  'violet': '#ee82ee',
  'indigo': '#4b0082',
  'gold': '#ffd700',
  'silver': '#c0c0c0',
  'beige': '#f5f5dc',
  'tan': '#d2b48c',
  'coral': '#ff7f50',
  'crimson': '#dc143c',
  'fuchsia': '#ff00ff',
  'khaki': '#f0e68c',
  'lavender': '#e6e6fa',
  'plum': '#dda0dd',
  'salmon': '#fa8072',
  'sienna': '#a0522d',
  'turquoise': '#40e0d0',
  'wheat': '#f5deb3',
};

function isColorDark(color) {
  let c = color ? color.trim().toLowerCase() : '';
  
  // Check if it's a color name and convert to hex
  if (COLOR_NAME_TO_HEX[c]) {
    c = COLOR_NAME_TO_HEX[c];
  }
  
  if (c[0] === '#') {
    c = c.substring(1);
    if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    if (c.length !== 6) return false;
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    return (0.299*r + 0.587*g + 0.114*b) < 186;
  }
  if (c.startsWith('rgb')) {
    const nums = c.match(/\d+/g);
    if (!nums || nums.length < 3) return false;
    const [r, g, b] = nums.map(Number);
    return (0.299*r + 0.587*g + 0.114*b) < 186;
  }
  return false;
}

const NoteCard = ({
  note,
  isDarkMode,
  onPress,
  onLongPress,
  isSelected,
  selectedFont,
}) => {
  const backgroundColor = note.color
    ? note.color
    : isDarkMode
    ? "#1c1c1c"
    : "#f0f0f0";

  const textColor = isColorDark(backgroundColor) ? '#fff' : '#000';

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
      <Text
        style={[
          styles.noteTitle,
          { color: textColor }
        ]}
      >
        {note.title}
      </Text>

        <View style={styles.noteCategoryContainer}>
          <Text
            style={styles.noteCategory}
          >
            {note.category || "All"}
          </Text>
        </View>
      
      <Text
        style={[
          styles.noteContent,
          { color: textColor },
        ]}
        numberOfLines={4}
      >
        {note.content}
      </Text>
      <Text
        style={[
          styles.timestamp,
          { color: isColorDark(backgroundColor) ? '#bbb' : '#666' },
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
    marginBottom: 10,
    marginHorizontal: 16,
  },
  noteTitle: {
    fontSize: 17,
    fontFamily: "interm",
  },
  noteContent: {
    fontSize: 12,
    fontFamily: "azeret",
  },
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 7,
    marginTop: 1,
  },
  
  timestamp: {
    fontSize: 12,
    textAlign: "right",
    fontFamily: "azeret",
  },
  selectedNote: {
    borderWidth: 2,
    borderColor: "#d71921",
  },
  noteCategoryContainer: {
    backgroundColor: "#006eff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "#7370ff",
    position: "absolute",
    top: 10,
    right: 10,

  },
  noteCategory: {
    fontSize: 13,
    fontFamily: "interm",
    color: "white",
  },
});

export default NoteCard; 