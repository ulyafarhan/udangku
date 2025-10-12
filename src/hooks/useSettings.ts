import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Settings } from '@/types';

export const defaultSettings: Settings = {
  // Business Settings
  businessName: 'Udangku Business',
  businessAddress: '',
  businessPhone: '',
  businessEmail: '',
  
  // Default Values
  defaultShrinkagePercentage: 5,
  defaultDailyPrice: 0,
  
  // Currency & Format
  currency: 'IDR',
  currencySymbol: 'Rp',
  timezone: 'Asia/Jakarta',
  dateFormat: 'dd/MM/yyyy',
  
  // Notifications
  enableNotifications: true,
  enableDebtReminders: true,
  debtReminderDays: 3,
  
  // Auto Backup
  enableAutoBackup: false,
  backupFrequency: 'weekly',
  
  // Theme & Display
  theme: 'light',
  language: 'id',
  itemsPerPage: 10,
  
  // Working Hours
  workingHoursStart: '08:00',
  workingHoursEnd: '17:00',
  workingDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  
  // Debt Settings
  defaultDebtDueDays: 30,
  enableAutoDebtReminders: true,
  
  createdAt: new Date().toISOString(),
};

export function useSettings() {
  // Mengambil data pengaturan (seharusnya hanya ada satu)
  const settingsArray = useLiveQuery(() => db.settings.toArray(), []);
  const settings = settingsArray?.[0];

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const now = new Date().toISOString();
    
    if (settings?.id) {
      await db.settings.update(settings.id, {
        ...newSettings,
        updatedAt: now,
      });
    } else {
      // Jika belum ada settings, buat yang baru dengan default values
      await db.settings.add({
        ...defaultSettings,
        ...newSettings,
        createdAt: now,
      });
    }
  };

  const resetSettings = async () => {
    if (settings?.id) {
      await db.settings.update(settings.id, {
        ...defaultSettings,
        id: settings.id,
        createdAt: settings.createdAt,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return { settings, updateSettings, resetSettings };
}