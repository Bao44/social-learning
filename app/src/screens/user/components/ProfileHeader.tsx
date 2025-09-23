import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAuth from '../../../../hooks/useAuth';
import { getFollowers, getFollowing } from '../../../api/follow/route';
import { getUserImageSrc } from '../../../api/image/route';
import Avatar from '../../../components/Avatar';
import { hp } from '../../../../helpers/common';
import { theme } from '../../../../constants/theme';

export default function ProfileHeader() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadFollows();
      }
    }, [user?.id]),
  );

  const loadFollows = async () => {
    try {
      const resF = await getFollowers(user.id);
      const resG = await getFollowing(user.id);
      if (resF?.success) setFollowers(resF.data || []);
      if (resG?.success) setFollowing(resG.data || []);
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar
          uri={getUserImageSrc(user?.avatar)}
          size={hp(12)}
          rounded={theme.radius.xxl * 100}
        />

        <View style={styles.info}>
          <Text style={styles.nick}>{user?.nick_name}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLabel}>bài viết</Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Follow', {
                  type: 'followers',
                  userId: user.id,
                })
              }
              style={styles.stat}
            >
              <Text style={styles.statNum}>{followers.length}</Text>
              <Text style={styles.statLabel}>người theo dõi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'Follow' as never,
                  {
                    type: 'following',
                    userId: user.id,
                  } as never,
                )
              }
              style={styles.stat}
            >
              <Text style={styles.statNum}>{following.length}</Text>
              <Text style={styles.statLabel}>đang theo dõi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile' as never)}
        >
          <Text style={styles.buttonText}>Chỉnh sửa trang cá nhân</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          //   onPress={() => navigation.navigate('Storage')}
        >
          <Text style={styles.buttonText}>Kho lưu trữ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bio}>
        <Text>{user?.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 92, height: 92, borderRadius: 92, backgroundColor: '#ddd' },
  info: { flex: 1 },
  nick: { fontSize: 24, marginLeft: 25 },
  statsRow: { flexDirection: 'row', marginTop: 20 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#888' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  buttonText: { color: '#111' },
  bio: { marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalBtn: { paddingVertical: 14, alignItems: 'center' },
  modalBtnText: { fontSize: 16 },
});
