import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  lives: number;
}

export default function LivesIndicator({ lives }: Props) {
  return (
    <View style={styles.container}>
      {/* Emoji ❄️ được giữ nguyên */}
      <Text style={styles.icon}>❄️</Text>
      <Text
        style={[styles.text, lives === 0 ? styles.textRed : styles.textGray]}
      >
        {lives}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
    color: '#60A5FA',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textRed: {
    color: '#EF4444',
  },
  textGray: {
    color: '#374151',
  },
});
