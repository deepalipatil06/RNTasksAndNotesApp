export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string | null;
};

export type FilterType = 'all' | 'completed' | 'pending';
