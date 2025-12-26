import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.subtitle}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.btn}>
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#b00020' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  btn: { marginTop: 12, backgroundColor: '#1976d2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600' }
});
