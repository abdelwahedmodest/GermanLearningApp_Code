import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Using MaterialCommunityIcons

// Import Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import QuizScreen from '../screens/QuizScreen';
import QAScreen from '../screens/QAScreen';
// Placeholder screens for others
import { View, Text, StyleSheet } from 'react-native';
const PlaceholderScreen = ({ route }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{route.name} Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e273a',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main application flow with Bottom Tabs
const MainAppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LessonsTab') { // Renamed Categories to LessonsTab for clarity
            // Choose an icon representing lessons/categories, e.g., book, search (like 3.png)
            iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline'; 
          } else if (route.name === 'ProfileTab') { // Renamed Rewards to ProfileTab
            iconName = focused ? 'account' : 'account-outline';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4fc3f7', // Active tab color (blue)
        tabBarInactiveTintColor: '#aaa', // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#2c3a52', // Tab bar background
          borderTopColor: '#44526f',
          paddingBottom: 5, // Add some padding if needed
          height: 60, // Adjust height
        },
        tabBarLabelStyle: {
            fontSize: 12,
        },
        // Support RTL layout for tabs
        tabBarButton: (props) => <TouchableOpacity {...props} style={[props.style, { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }]} />,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'الرئيسية' }} />
      <Tab.Screen name="LessonsTab" component={CategoriesScreen} options={{ title: 'الدروس' }} />
      <Tab.Screen name="ProfileTab" component={PlaceholderScreen} options={{ title: 'الملف الشخصي' }} />{/* Placeholder for Profile/Rewards */}
    </Tab.Navigator>
  );
};

// Main App Navigator using Stack
const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Onboarding" 
      screenOptions={{
        headerShown: false, // Globally hide headers, manage per screen if needed
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainApp" component={MainAppTabs} /> {/* Navigate to Tabs after Onboarding */} 
      {/* Screens accessible from within Tabs (e.g., Categories navigates here) */}
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QA" component={QAScreen} />
      <Stack.Screen name="Stories" component={PlaceholderScreen} />
      <Stack.Screen name="Rewards" component={PlaceholderScreen} />
      <Stack.Screen name="ParentSettings" component={PlaceholderScreen} />
      <Stack.Screen name="Success" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
