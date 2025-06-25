import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { sendMessageToGemini } from '../api/gemini/route';
import { Home, MessageCircle, MessageCircleX, Search } from 'lucide-react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBotAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const chatAnimation = useRef(new Animated.Value(0)).current;

  const generateId = () => Math.random().toString(36).slice(2, 10);

  const toggleChat = () => {
    const toValue = isChatOpen ? 0 : 1;
    setIsChatOpen(!isChatOpen);

    Animated.spring(chatAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(newMessages);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.';

      if (error instanceof Error) {
        if (error.message.includes('400')) {
          errorMessage = 'Yêu cầu không hợp lệ. Vui lòng kiểm tra API key.';
        } else if (error.message.includes('403')) {
          errorMessage = 'API key không hợp lệ hoặc đã hết hạn.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Đã vượt quá giới hạn API. Vui lòng thử lại sau.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Không có kết nối mạng. Vui lòng kiểm tra internet.';
        }
      }

      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
      Alert.alert('Lỗi', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Xóa đoạn chat',
      'Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => setMessages([]) },
      ],
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser
            ? styles.userMessageContainer
            : styles.assistantMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          {isUser ? (
            <Text style={[styles.messageText, styles.userText]}>
              {message.content}
            </Text>
          ) : (
            <Markdown>{message.content}</Markdown>
          )}
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const chatScale = chatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const chatOpacity = chatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View>
      {/* Chat Button */}
      <TouchableOpacity
        style={styles.chatToggle}
        onPress={toggleChat}
        activeOpacity={0.8}
      >
        {isChatOpen ? (
         <MessageCircleX size={28} color="#fff" strokeWidth={1.5} />
        ) : (
         <MessageCircle size={28} color="#fff" strokeWidth={1.5} />
        )}
      </TouchableOpacity>

      {/* Chat Modal */}
      {isChatOpen && (
        <Animated.View
          style={[
            styles.chatModal,
            {
              opacity: chatOpacity,
              transform: [{ scale: chatScale }],
            },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>🤖 AI Assistant</Text>
                <Text style={styles.headerSubtitle}>Powered by Gemini</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={clearChat}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleChat}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🤖</Text>
                  <Text style={styles.emptyText}>Xin chào!</Text>
                  <Text style={styles.emptySubtext}>
                    Tôi là AI Assistant. Hãy hỏi tôi bất cứ điều gì bạn muốn
                    biết!
                  </Text>
                </View>
              ) : (
                messages.map(renderMessage)
              )}

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.loadingText}>AI đang suy nghĩ...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Nhập câu hỏi của bạn..."
                  placeholderTextColor="#999"
                  multiline
                  maxLength={1000}
                  editable={!isLoading}
                  returnKeyType="send"
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!input.trim() || isLoading) && styles.sendButtonDisabled,
                  ]}
                  onPress={sendMessage}
                  disabled={!input.trim() || isLoading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sendButtonText}>
                    {isLoading ? '⏳' : '➤'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
};

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    marginTop: 6,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    marginTop: 4,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  code_block: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fence: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  list_item: {
    marginBottom: 4,
  },
  blockquote: {
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
  },
  thead: {
    backgroundColor: '#f5f5f5',
  },
  tbody: {},
  th: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontWeight: 'bold',
  },
  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  chatToggle: {
    position: 'absolute',
    bottom: 30, // Tương tự bottom-4
    right: 20, // Tương tự right-4
    width: 56, // Tương tự size-14 (14 * 4 = 56px)
    height: 56, // Tương tự size-14
    borderRadius: 28, // Tương tự rounded-full
    backgroundColor: '#000', // Tương tự bg-black
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Tương tự shadow-lg
    zIndex: 1000, // Tương tự z-50
  },
  toggleIcon: {
    fontSize: 24, // Tương tự size-8 (kích thước icon lớn)
    color: '#fff', // Tương tự text-white
  },
  chatModal: {
    position: 'absolute',
    bottom: 100, // Tương tự bottom-20
    right: 20, // Tương tự right-4
    left: 20, // Tương tự left-4
    height: Platform.OS === 'ios' ? 500 : 450, // Giữ nguyên
    backgroundColor: '#fff',
    borderRadius: 12, // Tương tự rounded-xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8, // Tương tự shadow-xl
    zIndex: 999, // Tương tự z-50
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  messageContainer: {
    marginVertical: 6,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  assistantMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: '#f1f3f4',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: '#e1e5e9',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatBotAI;
