import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TabId = 'posts' | 'saved' | 'tagged';

export default function ProfileTabs({
  active,
  setActive,
}: {
  active: TabId;
  setActive: (t: TabId) => void;
}) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'posts', label: 'Bài viết' },
    { id: 'saved', label: 'Đã lưu' },
    { id: 'tagged', label: 'Được gắn thẻ' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(t => (
        <TouchableOpacity
          key={t.id}
          style={styles.tab}
          onPress={() => setActive(t.id)}
        >
          <Text
            style={[
              styles.tabText,
              active === t.id ? styles.activeText : styles.inactiveText,
            ]}
          >
            {t.label}
          </Text>
          {active === t.id && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14 },
  activeText: { color: '#111', fontWeight: '600' },
  inactiveText: { color: '#888' },
  underline: {
    height: 2,
    backgroundColor: '#111',
    width: '60%',
    marginTop: 6,
    borderRadius: 2,
  },
});
