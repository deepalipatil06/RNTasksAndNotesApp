import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ title = 'No tasks', subtitle = 'Add a task to get started.' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' }
});
