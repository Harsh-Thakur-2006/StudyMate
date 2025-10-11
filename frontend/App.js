import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import our screens
import DashboardScreen from './src/screens/DashboardScreen';

// Create stack navigator
const Stack = createStackNavigator();

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0a',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#00ffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          cardStyle: { backgroundColor: '#0a0a0a' }
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ 
            title: 'StudyMate',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}