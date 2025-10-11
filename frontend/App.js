import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import our screens
import DashboardScreen from './src/screens/DashboardScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LogStudyScreen from './src/screens/LogStudyScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Subjects Stack Navigator
function SubjectsStack() {
  return (
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
        },
        cardStyle: { backgroundColor: '#0a0a0a' }
      }}
    >
      <Stack.Screen 
        name="SubjectsMain" 
        component={SubjectsScreen}
        options={{ title: 'Subjects' }}
      />
      <Stack.Screen 
        name="LogStudy" 
        component={LogStudyScreen}
        options={{ title: 'Log Study Session' }}
      />
    </Stack.Navigator>
  );
}

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'speedometer' : 'speedometer-outline';
            } else if (route.name === 'Subjects') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Timetable') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Progress') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00ffff',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#0a0a0a',
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            borderTopWidth: 1,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
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
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Tab.Screen 
          name="Subjects" 
          component={SubjectsStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Timetable" 
          component={TimetableScreen}
          options={{ title: 'Timetable' }}
        />
        <Tab.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{ title: 'Progress' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}