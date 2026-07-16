import { getAdminData, setAdminData, ADMIN_KEYS } from '../database/admin-store.js';

export interface AiChatStats {
  totalChats: number;
  todayChats: number;
  todayDate: string;
  totalErrors: number;
  lastChatAt: string | null;
}

const STATS_KEY = 'ai_chat_stats';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getAiChatStats(): Promise<AiChatStats> {
  const stats = await getAdminData<AiChatStats>(STATS_KEY);
  const today = todayKey();

  if (!stats) {
    return { totalChats: 0, todayChats: 0, todayDate: today, totalErrors: 0, lastChatAt: null };
  }

  if (stats.todayDate !== today) {
    return { ...stats, todayChats: 0, todayDate: today };
  }

  return stats;
}

export async function recordAiChatSuccess(): Promise<void> {
  const stats = await getAiChatStats();
  await setAdminData(STATS_KEY, {
    ...stats,
    totalChats: stats.totalChats + 1,
    todayChats: stats.todayChats + 1,
    todayDate: todayKey(),
    lastChatAt: new Date().toISOString(),
  });
}

export async function recordAiChatError(): Promise<void> {
  const stats = await getAiChatStats();
  await setAdminData(STATS_KEY, {
    ...stats,
    totalErrors: stats.totalErrors + 1,
    lastChatAt: new Date().toISOString(),
  });
}
