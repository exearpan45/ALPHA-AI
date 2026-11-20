import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_AGENT_TOOLS,
  INITIAL_CONVERSATIONS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_MEMORY_ENTRIES,
  INITIAL_WORKSPACE_FILES,
} from '../data/demoData';
import {
  ActivityEvent,
  AgentTool,
  AppSettings,
  ConfirmDialogConfig,
  Conversation,
  KnowledgeDocument,
  MemoryEntry,
  NavigationSection,
  ToastItem,
  WorkspaceFile,
} from '../types/alpha';
import {
  clearAlphaStorage,
  generateId,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../utils/storage';

export interface WorkspaceContextValue {
  activeSection: NavigationSection;
  setActiveSection: (section: NavigationSection) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  createConversation: (title?: string) => Conversation;
  updateConversation: (id: string, updater: (prev: Conversation) => Conversation) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  openConversationInChat: (id: string) => void;
  knowledgeDocs: KnowledgeDocument[];
  addKnowledgeDoc: (doc: KnowledgeDocument) => void;
  deleteKnowledgeDoc: (id: string) => void;
  memories: MemoryEntry[];
  addMemory: (entry: Omit<MemoryEntry, 'id' | 'updatedAt' | 'origin'>) => void;
  updateMemory: (id: string, updates: Partial<MemoryEntry>) => void;
  deleteMemory: (id: string) => void;
  files: WorkspaceFile[];
  addWorkspaceFile: (file: WorkspaceFile) => void;
  deleteWorkspaceFile: (id: string) => void;
  tools: AgentTool[];
  updateTool: (id: string, updates: Partial<AgentTool>) => void;
  activityLogs: ActivityEvent[];
  logActivity: (title: string, detail: string, section: NavigationSection) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
  confirmDialog: ConfirmDialogConfig | null;
  requestConfirm: (config: ConfirmDialogConfig) => void;
  closeConfirm: () => void;
  resetAllDemoData: () => void;
  exportBrowserDataJson: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() =>
    readStorage<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  );
  const [activeSection, setActiveSectionState] = useState<NavigationSection>(() =>
    readStorage<NavigationSection>(STORAGE_KEYS.activeSection, 'dashboard')
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    readStorage<Conversation[]>(STORAGE_KEYS.conversations, INITIAL_CONVERSATIONS)
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    () => {
      const saved = readStorage<Conversation[]>(
        STORAGE_KEYS.conversations,
        INITIAL_CONVERSATIONS
      );
      return saved[0]?.id ?? null;
    }
  );
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(() =>
    readStorage<KnowledgeDocument[]>(STORAGE_KEYS.knowledge, INITIAL_KNOWLEDGE_DOCS)
  );
  const [memories, setMemories] = useState<MemoryEntry[]>(() =>
    readStorage<MemoryEntry[]>(STORAGE_KEYS.memories, INITIAL_MEMORY_ENTRIES)
  );
  const [files, setFiles] = useState<WorkspaceFile[]>(() =>
    readStorage<WorkspaceFile[]>(STORAGE_KEYS.files, INITIAL_WORKSPACE_FILES)
  );
  const [tools, setTools] = useState<AgentTool[]>(() =>
    readStorage<AgentTool[]>(STORAGE_KEYS.tools, INITIAL_AGENT_TOOLS)
  );
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(() =>
    readStorage<ActivityEvent[]>(STORAGE_KEYS.activity, INITIAL_ACTIVITY_LOGS)
  );

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig | null>(null);

  // Sync theme variant & dark class onto <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.themeVariant === 'dark') {
      root.classList.add('dark');
      delete root.dataset.themeVariant;
    } else {
      root.classList.remove('dark');
      root.dataset.themeVariant = settings.themeVariant;
    }
  }, [settings.themeVariant]);

  // Persist slices to localStorage when saveDemoDataLocally is enabled
  useEffect(() => {
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.activeSection, activeSection);
    }
  }, [activeSection, settings.saveDemoDataLocally]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.conversations, conversations);
    }
  }, [conversations, settings.saveDemoDataLocally]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.knowledge, knowledgeDocs);
    }
  }, [knowledgeDocs, settings.saveDemoDataLocally]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.memories, memories);
    }
  }, [memories, settings.saveDemoDataLocally]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.files, files);
    }
  }, [files, settings.saveDemoDataLocally]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.tools, tools);
    }
  }, [tools, settings.saveDemoDataLocally]);

  useEffect(() => {
    if (settings.saveDemoDataLocally) {
      writeStorage(STORAGE_KEYS.activity, activityLogs);
    }
  }, [activityLogs, settings.saveDemoDataLocally]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = generateId('toast');
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 4000);
    },
    []
  );

  const logActivity = useCallback(
    (title: string, detail: string, section: NavigationSection) => {
      const event: ActivityEvent = {
        id: generateId('act'),
        title,
        detail,
        timestamp: new Date().toISOString(),
        section,
      };
      setActivityLogs((prev) => [event, ...prev].slice(0, 20));
    },
    []
  );

  const setActiveSection = useCallback((section: NavigationSection) => {
    setActiveSectionState(section);
  }, []);

  const createConversation = useCallback(
    (title = 'New Conversation') => {
      const now = new Date().toISOString();
      const created: Conversation = {
        id: generateId('conv'),
        title,
        createdAt: now,
        updatedAt: now,
        messages: [],
        isDemoSeed: false,
      };
      setConversations((prev) => [created, ...prev]);
      setActiveConversationId(created.id);
      logActivity('Started demonstration chat', title, 'chat');
      return created;
    },
    [logActivity]
  );

  const updateConversation = useCallback(
    (id: string, updater: (prev: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? updater(conv) : conv))
      );
    },
    []
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== id);
        setActiveConversationId((currentId) =>
          currentId === id ? remaining[0]?.id ?? null : currentId
        );
        return remaining;
      });
      logActivity('Deleted conversation', 'Removed from browser-local history', 'history');
      addToast({ title: 'Conversation removed', variant: 'info' });
    },
    [addToast, logActivity]
  );

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    logActivity('Cleared conversation history', 'All demo threads deleted locally', 'history');
    addToast({ title: 'Conversation history cleared', variant: 'info' });
  }, [addToast, logActivity]);

  const openConversationInChat = useCallback((id: string) => {
    setActiveConversationId(id);
    setActiveSectionState('chat');
  }, []);

  const addKnowledgeDoc = useCallback(
    (doc: KnowledgeDocument) => {
      setKnowledgeDocs((prev) => [doc, ...prev]);
      logActivity('Added browser file preview', `${doc.fileName} (not indexed)`, 'knowledge');
    },
    [logActivity]
  );

  const deleteKnowledgeDoc = useCallback(
    (id: string) => {
      setKnowledgeDocs((prev) => prev.filter((d) => d.id !== id));
      addToast({ title: 'Document entry removed', variant: 'info' });
    },
    [addToast]
  );

  const addMemory = useCallback(
    (entry: Omit<MemoryEntry, 'id' | 'updatedAt' | 'origin'>) => {
      const created: MemoryEntry = {
        ...entry,
        id: generateId('mem'),
        updatedAt: new Date().toISOString(),
        origin: 'browser-local',
      };
      setMemories((prev) => [created, ...prev]);
      logActivity('Added local memory entry', created.title, 'memory');
      addToast({ title: 'Memory saved in browser storage', variant: 'success' });
    },
    [addToast, logActivity]
  );

  const updateMemory = useCallback(
    (id: string, updates: Partial<MemoryEntry>) => {
      setMemories((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        )
      );
    },
    []
  );

  const deleteMemory = useCallback(
    (id: string) => {
      setMemories((prev) => prev.filter((m) => m.id !== id));
      logActivity('Removed memory entry', 'Deleted from browser storage', 'memory');
      addToast({ title: 'Memory entry deleted', variant: 'info' });
    },
    [addToast, logActivity]
  );

  const addWorkspaceFile = useCallback(
    (file: WorkspaceFile) => {
      setFiles((prev) => [file, ...prev]);
      logActivity('Added file preview', `${file.name} (browser-local only)`, 'files');
    },
    [logActivity]
  );

  const deleteWorkspaceFile = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      addToast({ title: 'File entry removed', variant: 'info' });
    },
    [addToast]
  );

  const updateTool = useCallback(
    (id: string, updates: Partial<AgentTool>) => {
      setTools((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    []
  );

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const requestConfirm = useCallback((config: ConfirmDialogConfig) => {
    setConfirmDialog(config);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const resetAllDemoData = useCallback(() => {
    clearAlphaStorage();
    setSettings(DEFAULT_SETTINGS);
    setConversations(INITIAL_CONVERSATIONS);
    setActiveConversationId(INITIAL_CONVERSATIONS[0]?.id ?? null);
    setKnowledgeDocs(INITIAL_KNOWLEDGE_DOCS);
    setMemories(INITIAL_MEMORY_ENTRIES);
    setFiles(INITIAL_WORKSPACE_FILES);
    setTools(INITIAL_AGENT_TOOLS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    addToast({
      title: 'Workspace reset to initial demonstration data',
      variant: 'success',
    });
  }, [addToast]);

  const exportBrowserDataJson = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      product: 'ALPHA AI',
      phase: 'Phase 1 Frontend Snapshot',
      settings,
      conversations,
      knowledgeDocs,
      memories,
      files,
      tools,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alpha-ai-phase1-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    addToast({
      title: 'Browser workspace snapshot exported',
      description: 'Downloaded local JSON backup.',
      variant: 'success',
    });
  }, [addToast, conversations, files, knowledgeDocs, memories, settings, tools]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      conversations,
      activeConversationId,
      setActiveConversationId,
      createConversation,
      updateConversation,
      deleteConversation,
      clearAllConversations,
      openConversationInChat,
      knowledgeDocs,
      addKnowledgeDoc,
      deleteKnowledgeDoc,
      memories,
      addMemory,
      updateMemory,
      deleteMemory,
      files,
      addWorkspaceFile,
      deleteWorkspaceFile,
      tools,
      updateTool,
      activityLogs,
      logActivity,
      settings,
      updateSettings,
      toasts,
      addToast,
      dismissToast,
      confirmDialog,
      requestConfirm,
      closeConfirm,
      resetAllDemoData,
      exportBrowserDataJson,
    }),
    [
      activeSection,
      setActiveSection,
      conversations,
      activeConversationId,
      createConversation,
      updateConversation,
      deleteConversation,
      clearAllConversations,
      openConversationInChat,
      knowledgeDocs,
      addKnowledgeDoc,
      deleteKnowledgeDoc,
      memories,
      addMemory,
      updateMemory,
      deleteMemory,
      files,
      addWorkspaceFile,
      deleteWorkspaceFile,
      tools,
      updateTool,
      activityLogs,
      logActivity,
      settings,
      updateSettings,
      toasts,
      addToast,
      dismissToast,
      confirmDialog,
      requestConfirm,
      closeConfirm,
      resetAllDemoData,
      exportBrowserDataJson,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
};
