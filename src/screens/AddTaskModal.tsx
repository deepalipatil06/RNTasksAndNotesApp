import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasksContext } from '../context/TasksContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

export default function AddTaskModal({ navigation }: Props) {
  const { addTask } = useTasksContext();
  const [title, setTitle] = useState('');
  const [dateText, setDateText] = useState(''); // accept ISO or yyyy-mm-dd for simplicity
  const [error, setError] = useState('');

  const onSubmit = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    const dueDate = dateText.trim() ? new Date(dateText.trim()).toISOString() : null;
    try {
      await addTask(title.trim(), dueDate);
      navigation.goBack();
    } catch {
      setError('Failed to add task. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task title</Text>
      <TextInput
        placeholder="e.g. Buy groceries"
        style={styles.input}
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (error) setError('');
        }}
      />

      <Text style={styles.label}>Due date (optional, yyyy-mm-dd)</Text>
      <TextInput
        placeholder="2025-12-31"
        style={styles.input}
        value={dateText}
        onChangeText={setDateText}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.btn, styles.btnSecondary]}>
          <Text style={[styles.btnText, styles.btnTextSecondary]}>Cancel</Text>
        </Pressable>
        <Pressable onPress={onSubmit} style={[styles.btn, { backgroundColor: '#1976d2', marginLeft: 8 }]}>
          <Text style={styles.btnText}>Add task</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    backgroundColor: '#fff'
  },
  error: { color: '#b00020', marginTop: 8 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#eee' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextSecondary: { color: '#333' }
});
