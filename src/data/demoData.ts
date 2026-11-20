import {
  ActivityEvent,
  AgentTool,
  AppSettings,
  Conversation,
  KnowledgeDocument,
  MemoryEntry,
  WorkspaceFile,
} from '../types/alpha';

const now = Date.now();
const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const OWNER_AVATAR_PATH = '/src/assets/images/avatar_owner_1795155667037.jpg';

export const DEFAULT_SETTINGS: AppSettings = {
  ownerName: 'Arpan Goswami',
  workspaceName: 'ALPHA AI',
  themeVariant: 'daylight',
  density: 'comfortable',
  reducedMotion: false,
  futureModelPreference: 'local-runtime',
  preferredLocalRuntime: 'Ollama / llama.cpp (Planned Phase 3)',
  backendUrl: 'http://localhost:8000',
  saveDemoDataLocally: true,
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-arch-review',
    title: 'Local-first backend architecture plan',
    createdAt: hoursAgo(3),
    updatedAt: minsAgo(28),
    isDemoSeed: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content:
          'Outline how Phase 2 FastAPI and SQLite storage should connect to this Phase 1 frontend without locking into a single AI provider.',
        timestamp: minsAgo(32),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        isDemoResponse: true,
        timestamp: minsAgo(28),
        content:
          'Demonstration Response (No AI inference is active in Phase 1):\n\nIn Phase 2, the frontend service layer can point to a configurable FastAPI base URL (for example http://localhost:8000) defined in Settings. Conversations, documents, and memory records will persist in local SQLite tables, while Phase 3 introduces a provider-agnostic model adapter supporting local runtimes before optional cloud APIs.',
      },
    ],
  },
  {
    id: 'conv-knowledge-layout',
    title: 'Document indexing and RAG privacy boundaries',
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(22),
    isDemoSeed: true,
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content:
          'How should personal documents be handled before any cloud model is ever used?',
        timestamp: hoursAgo(23),
      },
      {
        id: 'msg-4',
        role: 'assistant',
        isDemoResponse: true,
        timestamp: hoursAgo(22),
        content:
          'Demonstration Response (No AI inference is active in Phase 1):\n\nAll document parsing, chunking, and keyword or vector indexing should run locally first. In Phase 1, selecting a file in Knowledge Center only generates a browser-local preview—nothing is uploaded, chunked, or sent to any external service.',
      },
    ],
  },
  {
    id: 'conv-hardware-budget',
    title: 'Performance targets for modest laptop hardware',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    isDemoSeed: true,
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content:
          'Remind me of the UI performance constraints for running ALPHA AI smoothly on an older laptop.',
        timestamp: daysAgo(4),
      },
      {
        id: 'msg-6',
        role: 'assistant',
        isDemoResponse: true,
        timestamp: daysAgo(4),
        content:
          'Demonstration Response (No AI inference is active in Phase 1):\n\nPages are lazy-loaded on demand, animations stay within transform and opacity transitions under 200ms, and heavy shadow or backdrop blur effects are avoided to keep memory and GPU usage low.',
      },
    ],
  },
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'doc-prd-v1',
    title: 'ALPHA AI Product Specification (v1.0)',
    fileName: 'alpha-ai-prd-v1.md',
    category: 'Architecture',
    fileType: 'markdown',
    sizeBytes: 14_820,
    addedAt: hoursAgo(5),
    origin: 'demo',
    summary:
      'Core product principles, 6-phase delivery roadmap, privacy boundaries, and Phase 1 frontend acceptance checklist.',
    indexingStatus: 'Not Indexed (Phase 1 Demo)',
    previewContent: `# ALPHA AI — Core Principles\n\n- My data, my control.\n- My AI, my preferences.\n- Local-first wherever practical.\n- Cloud integration only when explicitly configured.\n\n## Roadmap\n1. Phase 1: Complete frontend workspace\n2. Phase 2: FastAPI + SQLite local backend\n3. Phase 3: Model abstraction layer (Local & Optional Cloud)\n4. Phase 4: Document chunking & personal RAG`,
  },
  {
    id: 'doc-fastapi-schema',
    title: 'Draft SQLite Schema for Phase 2 Backend',
    fileName: 'sqlite-schema-draft.json',
    category: 'Code',
    fileType: 'json',
    sizeBytes: 4_290,
    addedAt: daysAgo(1),
    origin: 'demo',
    summary:
      'Planned relational schema covering conversations, messages, knowledge_documents, memory_entries, and tool_permissions.',
    indexingStatus: 'Not Indexed (Phase 1 Demo)',
    previewContent: `{\n  "version": "phase-2-draft",\n  "engine": "sqlite3",\n  "tables": [\n    "conversations",\n    "messages",\n    "knowledge_documents",\n    "memory_entries",\n    "agent_tool_configs"\n  ],\n  "note": "Demonstration schema preview. No database is running in Phase 1."\n}`,
  },
  {
    id: 'doc-local-llm-notes',
    title: 'Quantized Local Model Evaluation Notes',
    fileName: 'local-model-benchmarks.md',
    category: 'Research',
    fileType: 'markdown',
    sizeBytes: 9_640,
    addedAt: daysAgo(3),
    origin: 'demo',
    summary:
      'Reference notes comparing 4-bit GGUF memory footprints on 8 GB and 16 GB RAM laptops for Phase 3 integration.',
    indexingStatus: 'Not Indexed (Phase 1 Demo)',
    previewContent: `# Local Runtime Notes (Phase 3 Planning)\n\nTarget hardware baseline: 8 GB - 16 GB RAM laptop.\n\n- Small 3B-4B models (Q4_K_M): ~2.6 GB RAM footprint\n- Medium 7B-8B models (Q4_K_M): ~5.2 GB RAM footprint\n\nAll inference testing is deferred until Phase 3.`,
  },
  {
    id: 'doc-reading-notes',
    title: 'Personal Knowledge Taxonomy',
    fileName: 'knowledge-taxonomy.txt',
    category: 'Notes',
    fileType: 'text',
    sizeBytes: 2_180,
    addedAt: daysAgo(6),
    origin: 'demo',
    summary:
      'Folder and category conventions for organizing personal engineering notes, research papers, and project plans.',
    indexingStatus: 'Not Indexed (Phase 1 Demo)',
    previewContent: `Taxonomy Categories:\n1. Architecture — system designs & specs\n2. Research — model evaluations & reading summaries\n3. Notes — daily logs & personal checklists\n4. Code — snippets, schemas, & configurations`,
  },
];

export const INITIAL_MEMORY_ENTRIES: MemoryEntry[] = [
  {
    id: 'mem-privacy-rule',
    title: 'Strict Local-First Data Preference',
    content:
      'Prefer local storage and local execution paths before suggesting external cloud services. Always disclose when data leaves the machine.',
    category: 'Preferences',
    updatedAt: hoursAgo(4),
    origin: 'demo',
    allowFutureContext: true,
  },
  {
    id: 'mem-stack-preference',
    title: 'Primary Development Stack',
    content:
      'Frontend built with React, Vite, TypeScript, and Tailwind CSS. Future backend planned with Python, FastAPI, and SQLite.',
    category: 'Technical',
    updatedAt: daysAgo(1),
    origin: 'demo',
    allowFutureContext: true,
  },
  {
    id: 'mem-project-alpha',
    title: 'ALPHA AI Incremental Roadmap',
    content:
      'Project owner is Arpan Goswami. Build sequence: Frontend (Phase 1) → Backend & Storage (Phase 2) → AI Models (Phase 3) → Knowledge RAG (Phase 4) → Agent Tools (Phase 5).',
    category: 'Projects',
    updatedAt: daysAgo(2),
    origin: 'demo',
    allowFutureContext: true,
  },
  {
    id: 'mem-response-style',
    title: 'Concise Technical Communication',
    content:
      'Prefer structured, direct engineering explanations without marketing hype or unnecessary filler.',
    category: 'Workflow',
    updatedAt: daysAgo(5),
    origin: 'demo',
    allowFutureContext: false,
  },
];

export const INITIAL_WORKSPACE_FILES: WorkspaceFile[] = [
  {
    id: 'file-1',
    name: 'alpha-ai-prd-v1.md',
    folder: '/specs',
    fileType: 'markdown',
    mimeType: 'text/markdown',
    sizeBytes: 14_820,
    modifiedAt: hoursAgo(5),
    origin: 'demo',
    previewText:
      'ALPHA AI Product Requirements Document — Version 1.0. Personal AI Agent and Knowledge Management Platform.',
  },
  {
    id: 'file-2',
    name: 'sqlite-schema-draft.json',
    folder: '/architecture',
    fileType: 'code',
    mimeType: 'application/json',
    sizeBytes: 4_290,
    modifiedAt: daysAgo(1),
    origin: 'demo',
    previewText: '{"version":"phase-2-draft","engine":"sqlite3","tables":["conversations","messages","knowledge_documents"]}',
  },
  {
    id: 'file-3',
    name: 'local-model-benchmarks.md',
    folder: '/research',
    fileType: 'markdown',
    mimeType: 'text/markdown',
    sizeBytes: 9_640,
    modifiedAt: daysAgo(3),
    origin: 'demo',
    previewText: 'Memory footprint notes for running quantized local models on modest hardware.',
  },
  {
    id: 'file-4',
    name: 'phase-roadmap-metrics.csv',
    folder: '/planning',
    fileType: 'data',
    mimeType: 'text/csv',
    sizeBytes: 1_840,
    modifiedAt: daysAgo(4),
    origin: 'demo',
    previewText: 'phase,scope,status\nPhase 1,Complete Frontend,Active\nPhase 2,FastAPI + SQLite,Planned\nPhase 3,Model Abstraction,Planned',
  },
  {
    id: 'file-5',
    name: 'privacy-checklist.pdf',
    folder: '/specs',
    fileType: 'pdf',
    mimeType: 'application/pdf',
    sizeBytes: 128_400,
    modifiedAt: daysAgo(7),
    origin: 'demo',
  },
];

export const INITIAL_AGENT_TOOLS: AgentTool[] = [
  {
    id: 'tool-doc-search',
    name: 'Document Search',
    description:
      'Search across locally ingested personal documents and return matching source passages.',
    category: 'Knowledge',
    targetPhase: 'Phase 4',
    preferenceEnabled: true,
    requiresConfirmation: false,
    localOnlyMode: true,
    permissionScope: 'Read-only access to indexed workspace documents',
  },
  {
    id: 'tool-knowledge-retrieval',
    name: 'Personal Knowledge Retrieval',
    description:
      'Retrieve relevant context chunks and approved memory entries to ground assistant replies.',
    category: 'Knowledge',
    targetPhase: 'Phase 4',
    preferenceEnabled: true,
    requiresConfirmation: false,
    localOnlyMode: true,
    permissionScope: 'Read-only access to approved memory and knowledge store',
  },
  {
    id: 'tool-file-analysis',
    name: 'File Analysis',
    description:
      'Inspect structured files (CSV, JSON, Markdown, logs) and summarize contents locally.',
    category: 'Files',
    targetPhase: 'Phase 5',
    preferenceEnabled: false,
    requiresConfirmation: true,
    localOnlyMode: true,
    permissionScope: 'Explicit file selection only; no automatic disk scanning',
  },
  {
    id: 'tool-calculator',
    name: 'Deterministic Calculator',
    description:
      'Evaluate arithmetic, unit conversions, and tabular math outside the language model.',
    category: 'Computation',
    targetPhase: 'Phase 5',
    preferenceEnabled: true,
    requiresConfirmation: false,
    localOnlyMode: true,
    permissionScope: 'Sandboxed expression evaluator; zero network or filesystem access',
  },
  {
    id: 'tool-code-assist',
    name: 'Code Assistance',
    description:
      'Analyze local snippets, suggest diffs, and format configuration files with explicit approval.',
    category: 'Code',
    targetPhase: 'Phase 5',
    preferenceEnabled: false,
    requiresConfirmation: true,
    localOnlyMode: true,
    permissionScope: 'Read workspace snippets; write actions require user confirmation',
  },
  {
    id: 'tool-web-research',
    name: 'Web Research',
    description:
      'Optional external web lookup when explicitly enabled by the workspace owner.',
    category: 'Research',
    targetPhase: 'Phase 5',
    preferenceEnabled: false,
    requiresConfirmation: true,
    localOnlyMode: false,
    permissionScope: 'Outbound HTTP GET only when explicitly triggered per query',
  },
  {
    id: 'tool-local-utils',
    name: 'Local System Utilities',
    description:
      'Controlled local utility commands with strict allowlists and per-action confirmation.',
    category: 'System',
    targetPhase: 'Phase 5',
    preferenceEnabled: false,
    requiresConfirmation: true,
    localOnlyMode: true,
    permissionScope: 'Disabled by default; requires allowlisted backend executor',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act-1',
    title: 'Workspace initialized in Phase 1 Demo Mode',
    detail: 'Demonstration conversations, documents, and memory loaded in browser storage.',
    timestamp: minsAgo(28),
    section: 'dashboard',
  },
  {
    id: 'act-2',
    title: 'Sample document loaded for inspection',
    detail: 'alpha-ai-prd-v1.md available in Knowledge Center (preview only).',
    timestamp: hoursAgo(5),
    section: 'knowledge',
  },
  {
    id: 'act-3',
    title: 'Memory permissions configured',
    detail: '3 of 4 demonstration memory entries marked eligible for future Phase 3 context.',
    timestamp: daysAgo(1),
    section: 'memory',
  },
  {
    id: 'act-4',
    title: 'Agent tool preferences saved',
    detail: 'All live tool execution remains disabled until Phase 5 backend implementation.',
    timestamp: daysAgo(2),
    section: 'tools',
  },
];
