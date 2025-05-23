import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { I18nManager } from 'react-native';

// Force RTL layout for Arabic language support
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
