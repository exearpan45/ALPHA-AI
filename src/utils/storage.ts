const STORAGE_PREFIX = 'alpha_ai_v1_';

export const STORAGE_KEYS = {
  conversations: `${STORAGE_PREFIX}conversations`,
  knowledge: `${STORAGE_PREFIX}knowledge`,
  memories: `${STORAGE_PREFIX}memories`,
  files: `${STORAGE_PREFIX}files`,
  tools: `${STORAGE_PREFIX}tools`,
  settings: `${STORAGE_PREFIX}settings`,
  activity: `${STORAGE_PREFIX}activity`,
  activeSection: `${STORAGE_PREFIX}active_section`,
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearAlphaStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch {
    // Ignore storage removal errors in restricted environments
  }
}

export function getAlphaStorageUsageBytes(): { totalBytes: number; keyCount: number } {
  try {
    let totalBytes = 0;
    let keyCount = 0;
    Object.values(STORAGE_KEYS).forEach((key) => {
      const value = window.localStorage.getItem(key);
      if (value !== null) {
        keyCount += 1;
        totalBytes += (key.length + value.length) * 2;
      }
    });
    return { totalBytes, keyCount };
  } catch {
    return { totalBytes: 0, keyCount: 0 };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type DateGroupLabel = 'Today' | 'Yesterday' | 'Previous 7 Days' | 'Older';

export function getDateGroup(isoString: string): DateGroupLabel {
  const date = new Date(isoString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const sevenDaysAgo = startOfToday - 7 * 86_400_000;
  const ts = date.getTime();

  if (ts >= startOfToday) return 'Today';
  if (ts >= startOfYesterday) return 'Yesterday';
  if (ts >= sevenDaysAgo) return 'Previous 7 Days';
  return 'Older';
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
