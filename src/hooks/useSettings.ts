import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Settings } from '@/types';

export function useSettings() {
  // Mengambil data pengaturan (seharusnya hanya ada satu)
  const settingsArray = useLiveQuery(() => db.settings.toArray(), []);
  const settings = settingsArray?.[0];

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (settings?.id) {
      await db.settings.update(settings.id, newSettings);
    }
  };

  return { settings, updateSettings };
}