import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/types';
import { addTodo, deleteTodo, fetchTodos, updateTodo } from '../services/tasksService';

type State = {
  items: Todo[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Todo[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'ADD_OPTIMISTIC'; payload: Todo }
  | { type: 'REPLACE_ITEM'; payload: Todo }
  | { type: 'TOGGLE_OPTIMISTIC'; id: number }
  | { type: 'DELETE_OPTIMISTIC'; id: number };

const initialState: State = { items: [], loading: false, error: null };
const STORAGE_KEY = 'tasks_cache_v1';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { items: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD_OPTIMISTIC':
      return { ...state, items: [action.payload, ...state.items] };
    case 'REPLACE_ITEM':
      return { ...state, items: state.items.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case 'TOGGLE_OPTIMISTIC':
      return { ...state, items: state.items.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)) };
    case 'DELETE_OPTIMISTIC':
      return { ...state, items: state.items.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

type ContextValue = {
  state: State;
  refresh: () => Promise<void>;
  addTask: (title: string, dueDate?: string | null) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

const TasksContext = createContext<ContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // hydrate cache
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: State = JSON.parse(raw);
          dispatch({ type: 'LOAD_SUCCESS', payload: parsed.items });
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // persist cache
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const refresh = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const todos = await fetchTodos();
      dispatch({ type: 'LOAD_SUCCESS', payload: todos });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: (e as Error).message });
    }
  }, []);

  useEffect(() => {
    // initial fetch
    refresh();
  }, [refresh]);

  const addTask = useCallback(async (title: string, dueDate?: string | null) => {
    const optimistic = {
      id: Math.floor(Math.random() * 1000000),
      title,
      completed: false,
      userId: 1,
      dueDate: dueDate ?? null
    } as Todo;
    dispatch({ type: 'ADD_OPTIMISTIC', payload: optimistic });
    try {
      const created = await addTodo(title, dueDate);
      dispatch({ type: 'REPLACE_ITEM', payload: created });
    } catch {
      // could revert; keep optimistic for UX
    }
  }, []);

  const toggleTask = useCallback(async (id: number) => {
    dispatch({ type: 'TOGGLE_OPTIMISTIC', id });
    const item = state.items.find((t) => t.id === id);
    if (!item) return;
    try {
      const updated = await updateTodo({ ...item, completed: !item.completed });
      dispatch({ type: 'REPLACE_ITEM', payload: updated });
    } catch {
      // revert on failure
      dispatch({ type: 'TOGGLE_OPTIMISTIC', id });
    }
  }, [state.items]);

  const deleteTask = useCallback(async (id: number) => {
    const prev = state.items;
    dispatch({ type: 'DELETE_OPTIMISTIC', id });
    try {
      await deleteTodo(id);
    } catch {
      // revert on failure
      dispatch({ type: 'LOAD_SUCCESS', payload: prev });
    }
  }, [state.items]);

  const value = useMemo(
    () => ({ state, refresh, addTask, toggleTask, deleteTask }),
    [state, refresh, addTask, toggleTask, deleteTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within TasksProvider');
  return ctx;
}
