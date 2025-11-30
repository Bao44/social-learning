import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function StoryHighlights() {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.highlightItem}>
          <View style={styles.highlightCircle}>
            <Image
              source={require('../../../../assets/images/default-avatar-profile-icon.jpg')}
              style={styles.highlightImage}
            />
          </View>
          <Text style={styles.highlightLabel}>🌿 Thiên nhiên</Text>
        </View>

        <TouchableOpacity style={styles.highlightItem} activeOpacity={0.7}>
          <View style={styles.addCircle}>
            <Plus size={24} color="#9ca3af" />
          </View>
          <Text style={styles.addLabel}>Mới</Text>
        </TouchableOpacity>

        {/* Có thể thêm nhiều highlight khác */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scrollContent: {
    paddingHorizontal: scale(16),
  },
  highlightItem: {
    width: scale(80),
    alignItems: 'center',
    marginRight: scale(16),
  },
  highlightCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    padding: scale(3),
    backgroundColor: '#f3f4f6',
    marginBottom: verticalScale(8),
  },
  highlightImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(29),
  },
  highlightLabel: {
    fontSize: moderateScale(12),
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  addCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: verticalScale(8),
  },
  addLabel: {
    fontSize: moderateScale(12),
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
});
