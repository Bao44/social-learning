import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import ChatBotAI from './src/chatbot/ChatBotAI';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Chat App</Text>
          <Text style={styles.subtitle}>
            Ứng dụng chat AI với Gemini - Hoàn toàn độc lập!
          </Text>
        </View>

        <View className="flex-1 items-center justify-center bg-yellow-400">
          <Text className='text-gray-50'>Open up App.js to start working on your app!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>🚀 Gọi trực tiếp Gemini API</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>📱 Không cần backend server</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>💬 Chat real-time mượt mà</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>🎨 UI/UX đẹp với animations</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>🌍 Hỗ trợ tiếng Việt</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hướng dẫn sử dụng</Text>
          <Text style={styles.instructionText}>
            1. Thêm Gemini API key vào code{'\n'}
            2. Nhấn nút chat ở góc dưới bên phải{'\n'}
            3. Bắt đầu trò chuyện với AI!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý</Text>
          <Text style={styles.noteText}>
            • Cần có kết nối internet{'\n'}
            • API key Gemini miễn phí{'\n'}
            • Dữ liệu chat không được lưu trữ
          </Text>
        </View>

        {/* Add some spacing for the chat button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <ChatBotAI />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  noteText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

export default App;