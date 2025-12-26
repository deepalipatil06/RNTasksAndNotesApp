import { useEffect, useState } from 'react';
import { getNote, setNote as setStoredNote } from '../storage/notesStorage';

export function useNote(id: number) {
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const n = await getNote(id);
        if (mounted) setNote(n);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const save = async (text: string) => {
    setNote(text);
    try {
      await setStoredNote(id, text);
    } catch {
      // swallow errors for now
    }
  };

  return { note, setNote: save, loading };
}
