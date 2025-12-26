import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { FilterType } from '../types/types';

type Props = {
  filter: FilterType;
  onChange: (f: FilterType) => void;
};

export default function FilterTabs({ filter, onChange }: Props) {
  const tabs: FilterType[] = ['all', 'completed', 'pending'];
  return (
    <View style={styles.row}>
      {tabs.map((t) => (
        <Pressable key={t} onPress={() => onChange(t)} style={[styles.tab, filter === t && styles.active]}>
          <Text style={[styles.text, filter === t && styles.textActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'space-around' },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#eee' },
  active: { backgroundColor: '#1976d2' },
  text: { color: '#333', fontWeight: '600' },
  textActive: { color: '#fff' }
});
