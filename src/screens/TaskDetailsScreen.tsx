///import React, { useMemo } from 'react';
//import { useMemo } from 'react';
import { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasksContext } from '../context/TasksContext';
import { useNote } from '../hooks/useNote';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen({ route }: Props) {
  const { id } = route.params;
  const { state } = useTasksContext();
  const task = useMemo(() => (state.items ?? []).find((t) => t.id === id), [state.items, id]);
  const { note, setNote, loading } = useNote(id);

  if (state.loading && !task) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.row}>Status: {task.completed ? 'Completed' : 'Pending'}</Text>
      <Text style={styles.row}>User ID: {task.userId}</Text>
      <Text style={[styles.subtitle, { marginTop: 16 }]}>Local note</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TextInput
          placeholder="Write something about this task..."
          style={styles.input}
          value={note}
          onChangeText={setNote}
          multiline
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  row: { fontSize: 14, color: '#555', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
    marginTop: 8
  }
});
