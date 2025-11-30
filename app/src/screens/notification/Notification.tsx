import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import {
  fetchNotifications,
  fetchNotificationsLearning,
} from '../../api/notification/route';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, BellOff } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import NotificationItem from './components/NotificationItem';
import NotificationItemLearning from './components/NotificationItemLearning';

const Notification = () => {
  const [activeTab, setActiveTab] = useState<'social' | 'learning'>('social');

  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLearning, setNotificationsLearning] = useState<any[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    getSocial();
    getLearning();
    cleanUp();
  }, []);

  const getSocial = async () => {
    const res = await fetchNotifications(user.id);
    if (res.success) setNotifications(res.data);
  };

  const getLearning = async () => {
    const res = await fetchNotificationsLearning(user.id);
    if (res.success) setNotificationsLearning(res.data);
  };

  const cleanUp = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    await supabase.functions.invoke('delete-old-notifications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  };

  const unreadSocial = notifications.filter(n => !n.is_read).length;
  const unreadLearning = notificationsLearning.filter(n => !n.is_read).length;

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
            <ArrowLeft size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Thông báo</Text>
          </View>
        </View>

        {/* --- Tabs --- */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'social' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('social')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'social' && styles.tabTextActive,
              ]}
            >
              Mạng xã hội ({unreadSocial})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'learning' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('learning')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'learning' && styles.tabTextActive,
              ]}
            >
              Học tập ({unreadLearning})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {(
          activeTab === 'social'
            ? notifications.length === 0
            : notificationsLearning.length === 0
        ) ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <BellOff size={moderateScale(48)} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có thông báo</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          >
            {activeTab === 'social'
              ? notifications.map(n => (
                  <NotificationItem
                    key={n.id}
                    item={n}
                    navigation={navigation}
                    onRead={(id: string) =>
                      setNotifications(prev =>
                        prev.map(x =>
                          x.id === id ? { ...x, is_read: true } : x,
                        ),
                      )
                    }
                  />
                ))
              : notificationsLearning.map(n => (
                  <NotificationItemLearning
                    key={n.id}
                    item={n}
                    navigation={navigation}
                    onRead={(id: string) =>
                      setNotificationsLearning(prev =>
                        prev.map(x =>
                          x.id === id ? { ...x, is_read: true } : x,
                        ),
                      )
                    }
                  />
                ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  headerGradient: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },

  headerContent: { flexDirection: 'row', alignItems: 'center' },

  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: { flex: 1, alignItems: 'center' },

  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff',
  },

  tabContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(16),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: moderateScale(12),
    padding: scale(4),
  },

  tabButton: {
    flex: 1,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
  },

  tabButtonActive: {
    backgroundColor: '#fff',
  },

  tabText: {
    textAlign: 'center',
    color: '#e5e7eb',
    fontSize: moderateScale(14),
  },

  tabTextActive: {
    color: '#4b5563',
    fontWeight: '700',
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: verticalScale(-10),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  emptyIconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },

  emptyTitle: { fontSize: moderateScale(18), fontWeight: 'bold' },

  listContainer: { padding: scale(16), paddingBottom: verticalScale(32) },
});
