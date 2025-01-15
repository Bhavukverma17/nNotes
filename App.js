import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Layouts from './app/_layout.js'; // Ehe hegi Main file, jithe code aa
import Settings from './app/settings.js'; 
import { FontProvider } from './app/FontContext.js'; // FONT da switch bnon lyi
import { ThemeProvider } from './app/ThemeContext.js'

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
    <FontProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Layouts} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
    </FontProvider>
    </ThemeProvider>
  );
}
