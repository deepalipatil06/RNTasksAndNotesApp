import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailsScreen';
import AddTaskModal from '../screens/AddTaskModal';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { id: number };
  AddTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task details' }} />
      <Stack.Screen name="AddTask" component={AddTaskModal} options={{ title: 'Add task', presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
