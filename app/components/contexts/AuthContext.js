import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../src/api/user/route';
import { getSocket } from '../../socket/socketClient';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const getUser = async userId => {
    try {
      const res = await getUserData(userId);
      if (res.success) {
        setUser(res.data); // Cập nhật user state với dữ liệu mới
      } else {
        setUser(null); // Nếu không lấy được dữ liệu, đặt user thành null
      }
    } catch (error) {
      console.error('Error fetching user public data:', error);
    }
  };

  const updateUserData = async (userData, email) => {
    getUser(userData.id);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Lỗi khi lấy session:', error);
      }
      const sessionUser = data?.session?.user;
      if (sessionUser) {
        await updateUserData(sessionUser, sessionUser.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await updateUserData(session.user, session.user.email);
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (user?.id) {
      socket.emit('user-online', { userId: user.id });

      // ✅ Chấp nhận cuộc gọi
      const handleAcceptCall = conversationId => {
        Toast.hide();
        navigation.navigate('ConferenceCall', {
          userID: user?.id,
          conferenceID: conversationId,
        });
      };

      // ✅ Từ chối cuộc gọi
      const handleDeclineCall = conversationId => {
        Toast.hide();
        socket.emit('declineCall', {
          conversationId,
          declinerId: user.id,
        });
      };

      const onIncomingCall = ({ callerName, conversationId }) => {
        Alert.alert(
          `${callerName} đang gọi bạn...`,
          'Bạn có muốn chấp nhận cuộc gọi không?',
          [
            {
              text: 'Từ chối',
              onPress: () => handleDeclineCall(conversationId),
              style: 'cancel',
            },
            {
              text: 'Đồng ý',
              onPress: () => handleAcceptCall(conversationId),
            },
          ],
          { cancelable: false },
        );
      };

      socket.on('incomingCall', onIncomingCall);

      return () => {
        socket.off('incomingCall', onIncomingCall);
      };
    }
  }, [user, navigation]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  callerText: {
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  declineButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
