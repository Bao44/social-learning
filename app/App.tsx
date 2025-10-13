import './global.css';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { AuthProvider } from './components/contexts/AuthContext';
import ChatBotAI from './src/chatbot/ChatBotAI';
import AppNavigation from './src/navigation/AppNavigation';
import OnlineStatusProvider from './components/contexts/OnlineStatusProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OnlineStatusProvider>
          <NavigationContainer>
            <AppNavigation />
            <Toast />
          </NavigationContainer>
          {/* <ChatBotAI /> */}
        </OnlineStatusProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
