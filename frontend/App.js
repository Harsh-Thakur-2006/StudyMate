import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import providers
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BackendTestScreen from './src/screens/BackendTestScreen';
import LogStudyScreen from './src/screens/LogStudyScreen';

// Import Header
import Header from './src/components/Header';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Subjects Stack Navigator
function SubjectsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen 
        name="SubjectsMain" 
        component={SubjectsScreen}
      />
      <Stack.Screen 
        name="LogStudy" 
        component={LogStudyScreen}
      />
    </Stack.Navigator>
  );
}

// Custom Header for Tab Screens
const CustomTabHeader = ({ title, subtitle }) => {
  return (
    <Header 
      title={title} 
      subtitle={subtitle} 
      showThemeToggle={true}
    />
  );
};

// Main Navigator Component
function MainNavigator() {
  const { colors } = useTheme();

  const tabHeaders = {
    Dashboard: { title: 'StudyMate', subtitle: 'Your smart study companion' },
    Timetable: { title: 'Timetable', subtitle: 'Schedule your study sessions' },
    Progress: { title: 'Progress', subtitle: 'Track your study journey' },
    Settings: { title: 'Settings', subtitle: 'Customize your app' },
    BackendTest: { title: 'Backend Test', subtitle: 'Test API connection' },
  };

  return (
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
          } else if (route.name === 'BackendTest') {
            iconName = focused ? 'server' : 'server-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.glass.background,
          borderTopColor: colors.glass.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          marginHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        header: () => {
          if (route.name === 'Subjects') {
            return null;
          }
          const { title, subtitle } = tabHeaders[route.name] || { title: route.name, subtitle: '' };
          return <CustomTabHeader title={title} subtitle={subtitle} />;
        },
        cardStyle: { backgroundColor: 'transparent' }
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
      />
      <Tab.Screen 
        name="Subjects" 
        component={SubjectsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Timetable" 
        component={TimetableScreen}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Tab.Screen 
        name="BackendTest" 
        component={BackendTestScreen}
      />
    </Tab.Navigator>
  );
}

// Main App component
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <MainNavigator/>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}