export type NavigationSection =
  | 'dashboard'
  | 'chat'
  | 'knowledge'
  | 'memory'
  | 'files'
  | 'tools'
  | 'history'
  | 'settings';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isDemoResponse?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  messages: ChatMessage[];
  isDemoSeed?: boolean;
}

export type KnowledgeCategory =
  | 'Architecture'
  | 'Research'
  | 'Notes'
  | 'Code'
  | 'Browser Preview';

export type DocumentFileType = 'markdown' | 'pdf' | 'json' | 'text' | 'code' | 'csv';

export interface KnowledgeDocument {
  id: string;
  title: string;
  fileName: string;
  category: KnowledgeCategory;
  fileType: DocumentFileType;
  sizeBytes: number;
  addedAt: string;
  origin: 'demo' | 'browser-preview';
  summary: string;
  previewContent: string;
  indexingStatus: 'Not Indexed (Phase 1 Demo)' | 'Local Preview Only (Unsynced)';
}

export type MemoryCategory =
  | 'Preferences'
  | 'Projects'
  | 'Technical'
  | 'Workflow'
  | 'Personal';

export interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  updatedAt: string;
  origin: 'demo' | 'browser-local';
  allowFutureContext: boolean;
}

export type WorkspaceFileType = 'markdown' | 'pdf' | 'code' | 'data' | 'image' | 'text';

export interface WorkspaceFile {
  id: string;
  name: string;
  folder: string;
  fileType: WorkspaceFileType;
  mimeType: string;
  sizeBytes: number;
  modifiedAt: string;
  origin: 'demo' | 'browser-preview';
  previewText?: string;
}

export type ToolCategory =
  | 'Research'
  | 'Computation'
  | 'Files'
  | 'Code'
  | 'Knowledge'
  | 'System';

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  targetPhase: string;
  preferenceEnabled: boolean;
  requiresConfirmation: boolean;
  localOnlyMode: boolean;
  permissionScope: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  section: NavigationSection;
}

export type ThemeVariant = 'daylight' | 'mist' | 'alabaster' | 'dark';
export type InterfaceDensity = 'comfortable' | 'compact';
export type FutureModelPreference = 'local-runtime' | 'cloud-optional' | 'undecided';

export interface AppSettings {
  ownerName: string;
  workspaceName: string;
  themeVariant: ThemeVariant;
  density: InterfaceDensity;
  reducedMotion: boolean;
  futureModelPreference: FutureModelPreference;
  preferredLocalRuntime: string;
  backendUrl: string;
  saveDemoDataLocally: boolean;
}

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: 'info' | 'success' | 'warning' | 'error';
}

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}
