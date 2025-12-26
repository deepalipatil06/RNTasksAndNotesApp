import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Todo } from '../types/types';
import { formatDate } from '../utils/date';

type Props = {
  item: Todo;
  onToggle: (id: number) => void;
  onPress: (id: number) => void;
};

export default function TaskItem({ item, onToggle, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(item.id)} style={[styles.container, item.completed && styles.completed]}>
      <Pressable onPress={() => onToggle(item.id)} style={styles.checkbox} accessibilityRole="button">
        <Text style={[styles.checkboxText, item.completed && styles.checkboxChecked]}>{item.completed ? '☑' : '☐'}</Text>
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.title, item.completed && styles.titleCompleted]} numberOfLines={1}>
          {item.title}
        </Text>
        {item.dueDate ? (
          <Text style={styles.due}>Due: {formatDate(item.dueDate)}</Text>
        ) : (
          <Text style={styles.dueMuted}>No due date</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ddd' },
  completed: { backgroundColor: '#f4f4f4' },
  checkbox: { width: 32 },
  checkboxText: { fontSize: 20 },
  checkboxChecked: { color: '#2e7d32' },
  content: { flex: 1, marginLeft: 8 },
  title: { fontSize: 16, color: '#222' },
  titleCompleted: { color: '#777', textDecorationLine: 'line-through' },
  due: { fontSize: 12, color: '#555', marginTop: 2 },
  dueMuted: { fontSize: 12, color: '#999', marginTop: 2 }
});
