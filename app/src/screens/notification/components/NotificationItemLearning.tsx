import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { convertToDate } from '../../../../helpers/formatTime';
import { markNotificationLearningAsRead } from '../../../api/notification/route';
import { BookOpen } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const NotificationItemLearning = ({ item, navigation, onRead }: any) => {
  const handleClick = async () => {
    if (!item.is_read) {
      await markNotificationLearningAsRead(item.id);
      onRead?.(item.id);
    }

    if (item.personalVocabId) {
      navigation.navigate('VocabularyDetail', {
        personalVocabId: item.personalVocabId,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !item.is_read && styles.unreadContainer,
        item.is_read && styles.readContainer,
      ]}
      onPress={handleClick}
      activeOpacity={0.8}
    >
      <View style={styles.icon}>
        <BookOpen size={moderateScale(20)} color="#667eea" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.time}>{convertToDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItemLearning;

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: verticalScale(10),
  },
  unreadContainer: {
    backgroundColor: '#f8faff',
    borderColor: '#e0e7ff',
    borderLeftWidth: scale(4),
    borderLeftColor: '#667eea',
  },
  readContainer: {
    opacity: 0.7,
  },
  icon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(6),
  },
  textContainer: { gap: verticalScale(4) },
  title: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    fontSize: moderateScale(13),
    color: '#6b7280',
  },
  time: {
    fontSize: moderateScale(12),
    color: '#9ca3af',
    marginTop: verticalScale(2),
  },
});
