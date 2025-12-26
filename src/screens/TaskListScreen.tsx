import React, { useMemo, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Pressable, Text, RefreshControl, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import FilterTabs from '../components/FilterTabs';
import { FilterType, Todo } from '../types/types';
import { useTheme } from '../theme/theme';
import { useTasksContext } from '../context/TasksContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export default function TaskListScreen({ navigation }: Props) {
  const { state, refresh, toggleTask, deleteTask } = useTasksContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const { colorScheme } = useTheme();

  const filtered = useMemo(() => {
    const items = state.items ?? [];
    switch (filter) {
      case 'completed':
        return items.filter((t) => t.completed);
      case 'pending':
        return items.filter((t) => !t.completed);
      default:
        return items;
    }
  }, [state.items, filter]);

  const onAdd = () => navigation.navigate('AddTask');

  const onToggle = (id: number) => toggleTask(id);

  const onPress = (id: number) => navigation.navigate('TaskDetail', { id });

  const onDelete = (id: number) => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) }
    ]);
  };

  const renderItem = useCallback(
    ({ item }: { item: Todo }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
        <View style={{ flex: 1 }}>
          <TaskItem item={item} onToggle={onToggle} onPress={onPress} />
        </View>
        <Pressable onPress={() => onDelete(item.id)} style={{ marginLeft: 8 }}>
          <Text style={{ color: '#b00020', fontWeight: '600' }}>Delete</Text>
        </Pressable>
      </View>
    ),
    []
  );

  const header = (
    <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <FilterTabs filter={filter} onChange={setFilter} />
      <Pressable onPress={onAdd} style={{ backgroundColor: '#1976d2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
      </Pressable>
    </View>
  );

  if (state.loading && state.items.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, color: colorScheme === 'dark' ? '#fff' : '#333' }}>Loading tasks...</Text>
      </View>
    );
  }

  if (state.error && state.items.length === 0) {
    return <ErrorState message="Failed to load tasks." onRetry={refresh} />;
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={header}
      renderItem={renderItem}
      ListEmptyComponent={<EmptyState title="No tasks found" subtitle="Try adding a new task." />}
      refreshControl={<RefreshControl refreshing={state.loading} onRefresh={refresh} />}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
