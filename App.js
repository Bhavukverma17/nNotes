import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/screens/Home.js'; // Ehe hegi Main file, jithe code aa
import Settings from './app/screens/settings.js'; 
import { FontProvider } from './app/FontContext.js'; // FONT da switch bnon lyi
import { ThemeProvider } from './app/ThemeContext.js'
import { TransitionPresets } from '@react-navigation/stack';
import { LanguageProvider } from './app/screens/LanguageContext.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
    <ThemeProvider>
    <FontProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerShown: false, 
        navigationBarColor: "white",
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} options={{
      ...TransitionPresets.SlideFromRightIOS, }} />
      </Stack.Navigator>
    </NavigationContainer>
    </FontProvider>
    </ThemeProvider>
    </LanguageProvider>
  );
}
