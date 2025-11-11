import React, { useContext } from 'react'; // Import useContext
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/screens/Home.js'; // Ehe hegi Main file, jithe code aa
import Settings from './app/screens/settings.js'; 
import { FontProvider } from './app/FontContext.js'; // FONT da switch bnon lyi
import { ThemeProvider, default as ThemeContext } from './app/ThemeContext.js' 
import { LanguageProvider } from './app/screens/LanguageContext.js';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaProvider

const Stack = createStackNavigator();

const customTransition = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 250,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};


const AppContent = () => {
  const { isDarkMode } = useContext(ThemeContext); 

  return (
    <SafeAreaView
          style={[            
            { backgroundColor: isDarkMode ? "black" : "#EEEEEE",
              flex: 1
             }, 
          ]}
    >
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerShown: false, 
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} options={customTransition} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
      <ThemeProvider>
      <FontProvider>
        <AppContent />
      </FontProvider>
      </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}