import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.background}>
      {/* Thanh tiến trình này sẽ hiển thị ngay lập tức, 
        không có animation, theo đúng yêu cầu "bỏ motion".
      */}
      <View style={[styles.progress, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#22C55E',
  },
});
