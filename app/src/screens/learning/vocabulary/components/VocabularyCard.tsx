// components/VocabularyCard.tsx
import { SparklesIcon } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 16;
const GRID_SPACING = 12;

interface VocabularyCardProps {
  vocab: any;
  isHighlighted?: boolean;
  onPress: () => void;
  viewMode: 'grid' | 'list';
  // UI TWEAK: Props to handle grid spacing
  isFirstInRow?: boolean;
  isLastInRow?: boolean;
}

export default function VocabularyCard({
  vocab,
  isHighlighted = false,
  onPress,
  viewMode,
  isFirstInRow = false,
  isLastInRow = false,
}: VocabularyCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const masteryColor =
    vocab.mastery_score >= 70
      ? '#10b981'
      : vocab.mastery_score >= 40
      ? '#f59e0b'
      : '#ef4444';

  const getMasteryBg = (score: number) => {
    if (score >= 70) return ['#d1fae5', '#a7f3d0'];
    if (score >= 40) return ['#fef3c7', '#fde68a'];
    return ['#fecaca', '#fca5a5'];
  };

  React.useEffect(() => {
    // Delay animation slightly for better visual effect
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // UI TWEAK: Conditional styles for grid/list view
  const containerStyle = [
    styles.container,
    viewMode === 'grid' && styles.gridItem,
    viewMode === 'grid' && isFirstInRow && { marginRight: GRID_SPACING / 2 },
    viewMode === 'grid' && isLastInRow && { marginLeft: GRID_SPACING / 2 },
    viewMode === 'list' && styles.listItem,
  ];

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={containerStyle}
      >
        {isHighlighted && <View style={styles.highlightOverlay} />}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.wordText,
                { fontSize: viewMode === 'grid' ? 20 : 18 },
              ]}
              numberOfLines={2}
            >
              {vocab.word}
            </Text>
            <SparklesIcon size={20} color="#f59e0b" />
          </View>

          {vocab.translation && (
            <Text style={styles.translationText} numberOfLines={1}>
              {vocab.translation}
            </Text>
          )}

          {/* Mastery Progress */}
          <View style={styles.masteryContainer}>
            <View style={styles.masteryHeader}>
              <Text style={styles.masteryLabel}>Mastery Level</Text>
              <Text style={[styles.masteryValue, { color: masteryColor }]}>
                {vocab.mastery_score}%
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={
                  vocab.mastery_score >= 70
                    ? ['#10b981', '#34d399']
                    : vocab.mastery_score >= 40
                    ? ['#f59e0b', '#fbbf24']
                    : ['#ef4444', '#f87171']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBar,
                  { width: `${vocab.mastery_score}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// REFACTOR: Use StyleSheet for better performance and organization
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  // UI TWEAK: Specific styles for list and grid items
  listItem: {
    marginBottom: 12,
  },
  gridItem: {
    marginBottom: GRID_SPACING,
    // Calculate width for 2 columns with spacing
    width: (screenWidth - CARD_MARGIN * 2 - GRID_SPACING) / 2,
    minHeight: 200,
  },
  highlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderRadius: 16,
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wordText: {
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  translationText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  masteryContainer: {
    marginBottom: 12,
    marginTop: 'auto', // Push to bottom
  },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  masteryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  masteryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});
