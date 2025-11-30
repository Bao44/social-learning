import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../../lib/supabase';
import { getSupabaseFileUrl } from '../../../api/image/route';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {
  Users,
  Star,
  RefreshCw,
  Sparkles,
  Award,
  Heart,
  ArrowLeft,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  nick_name: string;
  level: number;
  isFoF: boolean;
  isSameOrHigherLevel: boolean;
  mutualCount: number;
  matchCount: number;
}

const RecommendFriend = () => {
  const navigation = useNavigation<any>();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError('Vui lòng đăng nhập để xem gợi ý bạn bè');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        'recommend-friends',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (error) throw new Error(error.message);

      setFriends(data || []);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải gợi ý bạn bè');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const renderItem = ({ item }: { item: Friend }) => {
    const avatarUrl = item.avatar ? getSupabaseFileUrl(item.avatar) : null;

    return (
      <View style={styles.friendCard}>
        <TouchableOpacity
          style={styles.friendInfo}
          onPress={() =>
            navigation.navigate('UserFollow', { userSearch: item })
          }
          activeOpacity={0.8}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>
                  {item.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            {item.isSameOrHigherLevel && (
              <View style={styles.levelBadge}>
                <Award size={moderateScale(12)} color="#fff" />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{item.name}</Text>
              {item.isFoF && item.mutualCount > 0 && (
                <View style={styles.mutualBadge}>
                  <Heart size={moderateScale(10)} color="#ef4444" />
                  <Text style={styles.mutualText}>{item.mutualCount}</Text>
                </View>
              )}
            </View>

            <Text style={styles.userNickname}>{item.nick_name}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Star size={moderateScale(12)} color="#fbbf24" />
                <Text style={styles.statText}>Level {item.level}</Text>
              </View>
              <View style={styles.statItem}>
                <Sparkles size={moderateScale(12)} color="#667eea" />
                <Text style={styles.statText}>{item.matchCount} phù hợp</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <View style={styles.loadingIconContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
      <Text style={styles.loadingTitle}>Đang tìm gợi ý bạn bè</Text>
      <Text style={styles.loadingDescription}>
        Chúng tôi đang phân tích để tìm những người phù hợp với bạn...
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <View style={styles.errorIconContainer}>
        <Text style={styles.errorIcon}>❌</Text>
      </View>
      <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
      <Text style={styles.errorDescription}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={fetchFriends}
        activeOpacity={0.8}
      >
        <RefreshCw size={moderateScale(16)} color="#fff" />
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      <View style={styles.emptyIconContainer}>
        <Users size={moderateScale(48)} color="#9ca3af" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có gợi ý bạn bè</Text>
      <Text style={styles.emptyDescription}>
        Hãy thử follow một số người để có thêm gợi ý phù hợp
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
            <ArrowLeft size={moderateScale(20)} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Gợi ý bạn bè</Text>
          </View>

          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {loading && renderLoadingState()}
        {error && !loading && renderErrorState()}
        {!loading && !error && friends.length === 0 && renderEmptyState()}
        {!loading && !error && friends.length > 0 && (
          <FlatList
            data={friends}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecommendFriend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerGradient: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRight: {
    width: moderateScale(40),
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: verticalScale(-12),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(40),
  },
  loadingIconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  loadingTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: verticalScale(8),
  },
  loadingDescription: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: verticalScale(20),
  },
  errorIconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  errorIcon: {
    fontSize: moderateScale(32),
  },
  errorTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: verticalScale(8),
  },
  errorDescription: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(24),
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: scale(8),
    fontSize: moderateScale(14),
  },
  emptyIconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: verticalScale(8),
  },
  emptyDescription: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(24),
  },
  exploreButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  listContainer: {
    padding: scale(16),
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  avatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  avatarFallback: {
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(2),
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1f2937',
    marginRight: scale(8),
  },
  mutualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
  },
  mutualText: {
    fontSize: moderateScale(10),
    color: '#ef4444',
    fontWeight: '600',
    marginLeft: scale(2),
  },
  userNickname: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: verticalScale(6),
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginLeft: scale(4),
  },
});
