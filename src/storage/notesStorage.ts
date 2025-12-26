import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'task_notes_v1';

export type NotesMap = Record<string, string>;

async function readAll(): Promise<NotesMap> {
  const raw = await AsyncStorage.getItem(NOTES_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function getNote(id: number): Promise<string> {
  const all = await readAll();
  return all[String(id)] ?? '';
}

export async function setNote(id: number, note: string): Promise<void> {
  const all = await readAll();
  const next = { ...all, [String(id)]: note };
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(next));
}
