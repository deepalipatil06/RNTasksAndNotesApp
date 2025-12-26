import { api } from './api';
import { Todo } from '../types/types';

export async function fetchTodos(): Promise<Todo[]> {
  const todos = await api.get<Todo[]>('/todos');
  return todos.slice(0, 50).map((t, idx) => ({
    ...t,
    dueDate: idx % 5 === 0 ? new Date(Date.now() + idx * 86400000).toISOString() : null
  }));
}

export async function addTodo(title: string, dueDate?: string | null): Promise<Todo> {
  const payload = { title, completed: false, userId: 1, dueDate: dueDate ?? null };
  const created = await api.post<Todo>('/todos', payload);
  return { ...created, id: Math.floor(Math.random() * 100000), dueDate: payload.dueDate };
}

export async function updateTodo(todo: Todo): Promise<Todo> {
  const updated = await api.put<Todo>(`/todos/${todo.id}`, todo);
  return { ...updated, ...todo };
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}
