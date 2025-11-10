import { useEffect, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import { getSocket } from '../../../../socket/socketClient';
import {
  fetchMessages,
  markMessagesAsRead,
  sendMessage,
} from '../../../api/chat/message/route';
import MessageSender from './components/MessageSender';
import MessageReceiver from './components/MessageReceiver';
import { hp } from '../../../../helpers/common';
import {
  ArrowLeft,
  Info,
  Paperclip,
  Phone,
  Smile,
  Video,
  Send,
  MessageSquare,
  Users,
} from 'lucide-react-native';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { checkUserOnline } from '../../../api/user/route';
import Toast from 'react-native-toast-message';

const ChatDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { conversation } = route.params;
  const [text, setText] = useState<string>('');
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [onlineStatus, setOnlineStatus] = useState<boolean>(false);
  const [offlineTime, setOfflineTime] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  // Lắng nghe sự kiện tin nhắn mới từ socket
  useEffect(() => {
    const socket = getSocket();
    const conversationId = conversation?.id;
    if (conversationId) {
      socket.emit('joinRoom', conversationId);
    }

    socket.on('newMessage', (newMessage: any) => {
      setMessages(prev => [newMessage, ...prev]);
      if (newMessage.senderId !== user?.id && conversation && user) {
        markMessagesAsRead(conversation.id, user.id);
      }
    });

    socket.on(
      'markMessagesAsRead',
      ({
        userId,
        seenAt,
        messageIds,
      }: {
        userId: string;
        seenAt: string;
        messageIds: string[];
      }) => {
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (messageIds.includes(msg._id)) {
              if (
                !msg.seens.some(
                  (seen: { userId: string }) => seen.userId === userId,
                )
              ) {
                msg.seens.push({ userId, seenAt });
              }
            }
            return msg;
          }),
        );
      },
    );

    return () => {
      socket.off('newMessage');
      socket.off('markMessagesAsRead');
      if (conversationId) {
        socket.emit('leaveRoom', conversationId);
      }
    };
  }, [user?.id, conversation?.id]);

  // Lấy tin nhắn từ server
  useEffect(() => {
    const fetchDataMessages = async () => {
      const conversationId = conversation?.id;
      if (!conversationId) return;
      const data = await fetchMessages(conversationId);
      setMessages(data);
      if (user) {
        await markMessagesAsRead(conversationId, user.id);
      }
    };
    fetchDataMessages();
  }, [conversation?.id]);

  useEffect(() => {
    const checkOnlineStatus = async () => {
      if (!conversation?.members || !user) return;
      setLoadingStatus(true); // Bắt đầu loading

      const otherMembers = conversation.members.filter(
        (m: any) => m.id !== user?.id,
      );

      if (conversation.type === 'private') {
        if (otherMembers.length > 0) {
          const otherMember = otherMembers[0];
          try {
            const res = await checkUserOnline(otherMember.id);
            setOnlineStatus(res.data.isOnline);
            setOfflineTime(res.data.isOnline ? null : res.data.offlineTime);
          } catch (error) {
            console.error('Failed to check user online status:', error);
            setOnlineStatus(false);
            setOfflineTime(null);
          }
        }
      } else {
        if (otherMembers.length > 0) {
          try {
            const statusPromises = otherMembers.map((member: any) =>
              checkUserOnline(member.id),
            );
            const statusResults = await Promise.all(statusPromises);
            const isAnyoneOnline = statusResults.some(res => res.data.isOnline);
            setOnlineStatus(isAnyoneOnline);
            setOfflineTime(null);
          } catch (error) {
            console.error('Failed to check group online status:', error);
            setOnlineStatus(false);
            setOfflineTime(null);
          }
        }
      }
      setLoadingStatus(false);
    };

    checkOnlineStatus();
    const unsubscribe = navigation.addListener('focus', checkOnlineStatus);
    return unsubscribe;
  }, [conversation, user?.id, navigation]);

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (text.trim() === '' && files.length === 0) return;
    if (!user) return;
    const formData = new FormData();
    formData.append('conversationId', conversation?.id || '');
    formData.append('senderId', user.id);
    if (text) formData.append('text', text);
    if (files.length > 0) {
      files.forEach(f => formData.append('files', f));
    }

    const res = await sendMessage({
      conversationId: conversation?.id || '',
      senderId: user.id,
      text,
      files,
    });
    setText('');
  };

  const handleStartCall = () => {
    if (!onlineStatus) {
      const message =
        conversation?.type === 'private'
          ? 'Người dùng không online'
          : 'Thành viên không online';
      Toast.show({ type: 'info', text1: message });
      return;
    }
    const socket = getSocket();
    const callPayload = {
      conversationId: conversation?.id,
      callerId: user?.id,
      callerName: user?.name,
      members: conversation?.members,
    };

    socket.emit('startCall', callPayload);
    
    navigation.navigate('ConferenceCall', {
      userID: user?.id,
      conferenceID: conversation?.id,
    });
  };

  const getConversationName = () => {
    if (conversation?.type === 'private') {
      return conversation?.members.filter(
        (member: { id: string }) => member.id !== user?.id,
      )[0]?.name;
    }
    return (
      conversation?.name ||
      `Bạn, ${conversation?.members
        .filter((m: { id: string }) => m.id !== user?.id)
        .map((m: { name: string }) => m.name)
        .join(', ')}`
    );
  };

  const getMemberCount = () => {
    if (conversation?.type === 'group') {
      return conversation?.members?.length || 0;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {getConversationName()}
              </Text>

              {loadingStatus ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={{ alignSelf: 'flex-start' }}
                />
              ) : conversation?.type === 'private' ? (
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      onlineStatus ? styles.statusOnline : styles.statusOffline,
                    ]}
                  />
                  <Text style={styles.headerSubtitle}>
                    {onlineStatus
                      ? 'Đang hoạt động'
                      : offlineTime || 'Ngoại tuyến'}
                  </Text>
                </View>
              ) : getMemberCount() ? (
                <Text style={styles.headerSubtitle}>
                  {getMemberCount()} thành viên
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleStartCall}
              activeOpacity={0.8}
            >
              <Phone size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log('Info clicked')}
              activeOpacity={0.8}
            >
              <Info size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={messages}
          keyExtractor={item => item?._id}
          renderItem={({ item }) => (
            <View key={item?._id} style={styles.messageContainer}>
              {item?.senderId === user?.id ? (
                <MessageSender message={item} />
              ) : (
                <MessageReceiver message={item} />
              )}
            </View>
          )}
          inverted
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input area (Giữ nguyên) */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TouchableOpacity
                onPress={() => console.log('Smile clicked')}
                style={styles.inputButton}
                activeOpacity={0.8}
              >
                <Smile size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => console.log('Paperclip clicked')}
                style={styles.inputButton}
                activeOpacity={0.8}
              >
                <Paperclip size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TextInput
                placeholder="Nhập tin nhắn..."
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                onKeyPress={e => {
                  if (e.nativeEvent.key === 'Enter') {
                    e.preventDefault?.();
                    handleSendMessage();
                  }
                }}
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={1000}
              />

              <TouchableOpacity
                onPress={handleSendMessage}
                style={[
                  styles.sendButton,
                  text.trim()
                    ? styles.sendButtonActive
                    : styles.sendButtonInactive,
                ]}
                disabled={!text.trim()}
                activeOpacity={0.8}
              >
                <Send size={18} color={text.trim() ? '#fff' : '#9ca3af'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Status (Mới)
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOnline: {
    backgroundColor: '#22C55E', // green-500
  },
  statusOffline: {
    backgroundColor: '#EF4444', // red-500
  },
  // Content (Giữ nguyên)
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: -12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', // Quan trọng để bo góc
  },
  messageContainer: {
    marginBottom: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  // Input (Giữ nguyên)
  inputSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#667eea',
    elevation: 2,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendButtonInactive: {
    backgroundColor: '#f3f4f6',
  },
});
