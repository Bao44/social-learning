// screens/VocabularyPage.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuth from '../../../../hooks/useAuth';
import { getListPersonalVocabByUserIdAndCreated } from '../../../api/learning/vocabulary/route';
import VocabularyCard from './components/VocabularyCard';
import {
  ArrowLeft,
  BookOpenIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  X,
} from 'lucide-react-native';

const GRID_COLS = 2;

export default function Vocabulary() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const personalVocabId = route.params?.personalVocabId;

  const [listPersonalVocab, setListPersonalVocab] = useState<any[]>([]);
  const [filteredVocab, setFilteredVocab] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

  const loadVocab = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const res = await getListPersonalVocabByUserIdAndCreated({
        userId: user.id,
      });
      if (res.success) {
        setListPersonalVocab(res.data || []);
        setFilteredVocab(res.data || []);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải từ vựng');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadVocab();
  }, [loadVocab]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVocab(listPersonalVocab);
    } else {
      const filtered = listPersonalVocab.filter(vocab =>
        vocab.word.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredVocab(filtered);
    }
  }, [searchQuery, listPersonalVocab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadVocab();
    setRefreshing(false);
  }, [loadVocab]);

  const handleVocabPress = (vocabId: string) => {
    navigation.navigate('VocabularyDetail', { vocabId });
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const renderCard = ({ item, index }: { item: any; index: number }) => (
    <VocabularyCard
      vocab={item}
      isHighlighted={item.id === personalVocabId}
      onPress={() => handleVocabPress(item.id)}
      viewMode={viewMode}
      isFirstInRow={viewMode === 'grid' && index % 2 === 0}
      isLastInRow={viewMode === 'grid' && index % 2 !== 0}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Animated.View
        style={useAnimatedStyle(() => ({
          transform: [
            {
              translateY: withRepeat(
                withSequence(
                  withTiming(-10, { duration: 1000 }),
                  withTiming(0, { duration: 1000 }),
                ),
                -1,
                true,
              ),
            },
          ],
        }))}
      >
        <LinearGradient
          colors={['rgba(249, 115, 22, 0.2)', 'rgba(236, 72, 153, 0.2)']}
          style={styles.emptyIconContainer}
        >
          <BookOpenIcon size={40} color="#f59e0b" />
        </LinearGradient>
      </Animated.View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Không tìm thấy từ vựng' : 'Chưa có từ vựng'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Hãy thử từ khóa khác' : 'Bắt đầu học từ vựng ngay!'}
      </Text>
      {searchQuery && (
        <TouchableOpacity onPress={clearSearch} style={{ marginTop: 20 }}>
          <LinearGradient
            colors={['#f59e0b', '#ef4444']}
            style={styles.clearSearchButton}
          >
            <Text style={styles.clearSearchButtonText}>Xóa tìm kiếm</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const ListHeader = () => {
    const totalWords = listPersonalVocab.length;
    const averageMastery =
      totalWords > 0
        ? Math.round(
            listPersonalVocab.reduce(
              (sum, vocab) => sum + (vocab.mastery_score || 0),
              0,
            ) / totalWords,
          )
        : 0;
    const wordsToReview = listPersonalVocab.filter(
      vocab => (vocab.mastery_score || 0) < 70,
    ).length;

    return (
      <View style={styles.listHeaderContainer}>
        {/* Stats Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
        >
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { borderColor: '#fee2e2' }]}>
              <Text style={styles.statLabel}>Tổng từ</Text>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>
                {totalWords}
              </Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#d1fae5' }]}>
              <Text style={styles.statLabel}>Độ thông thạo TB</Text>
              <Text style={[styles.statValue, { color: '#10b981' }]}>
                {averageMastery}%
              </Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#fef3c7' }]}>
              <Text style={styles.statLabel}>Cần ôn</Text>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>
                {wordsToReview}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Search and View Toggle */}
        <View style={styles.controlsContainer}>
          <View style={styles.searchWrapper}>
            <SearchIcon size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Tìm kiếm từ vựng..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearSearchIcon}
              >
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={[
                styles.toggleButton,
                {
                  backgroundColor:
                    viewMode === 'grid' ? '#f59e0b' : 'transparent',
                },
              ]}
            >
              <GridIcon
                size={20}
                color={viewMode === 'grid' ? '#fff' : '#374151'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[
                styles.toggleButton,
                {
                  backgroundColor:
                    viewMode === 'list' ? '#f59e0b' : 'transparent',
                  marginLeft: 4,
                },
              ]}
            >
              <ListIcon
                size={20}
                color={viewMode === 'list' ? '#fff' : '#374151'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && listPersonalVocab.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#78BBA0', '#96CEB4']}
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
            <View>
              <Text style={styles.headerTitle}>Từ vựng của tôi</Text>
              <Text style={styles.headerSubtitle}>
                Quản lý và ôn tập từ vựng
              </Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <View style={styles.contentArea}>
        <FlatList
          key={viewMode}
          data={filteredVocab}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
          numColumns={viewMode === 'grid' ? GRID_COLS : 1}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </View>
    </SafeAreaView>
  );
}

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
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  headerRight: {
    width: 40,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
    marginTop: -12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  listHeaderContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsScroll: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 48,
    paddingRight: 48,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  clearSearchIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  listContentContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  clearSearchButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearSearchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
