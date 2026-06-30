export interface VisitorStats {
  baseCount: number;
  visits: number;
}

export function getVisitorTotal(stats: VisitorStats): number {
  return (stats.baseCount || 0) + (stats.visits || 0);
}

export async function fetchVisitorCount(): Promise<number> {
  try {
    const res = await fetch('/api/admin-data/visitor-count');
    const json = await res.json();
    if (json.success && json.data) {
      return getVisitorTotal(json.data);
    }
  } catch {
    /* ignore */
  }
  return 10000;
}

const SESSION_KEY = 'tarhal_visit_recorded';

export async function recordVisitIfNeeded(): Promise<number | null> {
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
    return null;
  }

  try {
    const res = await fetch('/api/admin-data/visitor-count/record', { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return getVisitorTotal(json.data);
    }
  } catch {
    /* ignore */
  }
  return null;
}
