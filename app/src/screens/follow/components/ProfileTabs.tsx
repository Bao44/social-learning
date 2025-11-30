import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function ProfileTabs() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab}>
        <Text style={[styles.tabText]}>Bài viết</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  tabText: {
    fontSize: moderateScale(14),
  },
  activeText: {
    color: '#111',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#888',
  },
  underline: {
    height: verticalScale(2),
    backgroundColor: '#111',
    width: '60%',
    marginTop: verticalScale(6),
    borderRadius: moderateScale(2),
  },
});
