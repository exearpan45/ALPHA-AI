import {
  DocumentFileType,
  KnowledgeDocument,
  WorkspaceFile,
  WorkspaceFileType,
} from '../types/alpha';
import { generateId } from '../utils/storage';

const MAX_PREVIEW_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB frontend preview cap

/**
 * Generates an honest Phase 1 demonstration reply.
 * Explicitly states that no real AI inference or backend call is occurring.
 */
export function buildSimulatedDemoReply(userPrompt: string): string {
  const trimmed = userPrompt.trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes('model') || lower.includes('ollama') || lower.includes('cloud')) {
    return (
      'Demonstration Response (No AI inference is active in Phase 1):\n\n' +
      `Your prompt ("${trimmed.slice(0, 90)}${trimmed.length > 90 ? '...' : ''}") was captured locally in your browser. ` +
      'In Phase 3, ALPHA AI will route requests through your selected local runtime or explicitly configured cloud adapter via the backend service.'
    );
  }

  if (lower.includes('file') || lower.includes('document') || lower.includes('knowledge')) {
    return (
      'Demonstration Response (No AI inference is active in Phase 1):\n\n' +
      'Document indexing and Retrieval-Augmented Generation (RAG) are scheduled for Phase 4. ' +
      'Right now, files added in Knowledge Center or File Manager remain browser-local previews only and are not sent to any server.'
    );
  }

  if (lower.includes('memory') || lower.includes('remember')) {
    return (
      'Demonstration Response (No AI inference is active in Phase 1):\n\n' +
      'Memory entries can be created, edited, and toggled in the Personal Memory section. ' +
      'In Phase 1 these entries persist in browser localStorage; Phase 2–4 will move them into your local SQLite store with explicit retrieval permissions.'
    );
  }

  return (
    'Demonstration Response (No AI inference is active in Phase 1):\n\n' +
    `Received message: "${trimmed}".\n\n` +
    'This workspace is running the Phase 1 frontend release. Conversations are saved locally in your browser so you can test the interface, renaming, and history organization without an API key or backend server.'
  );
}

function detectDocType(fileName: string): DocumentFileType {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'md' || ext === 'markdown') return 'markdown';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'json') return 'json';
  if (ext === 'csv') return 'csv';
  if (['ts', 'tsx', 'js', 'py', 'html', 'css', 'yml', 'yaml'].includes(ext)) return 'code';
  return 'text';
}

function detectWorkspaceFileType(fileName: string, mimeType: string): WorkspaceFileType {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
    return 'image';
  }
  if (ext === 'pdf' || mimeType === 'application/pdf') return 'pdf';
  if (ext === 'md' || ext === 'markdown') return 'markdown';
  if (['csv', 'json', 'parquet', 'tsv'].includes(ext)) return 'data';
  if (['ts', 'tsx', 'js', 'py', 'rs', 'go', 'sh', 'yaml', 'yml'].includes(ext)) return 'code';
  return 'text';
}

export async function readLocalFileForKnowledgePreview(
  file: File
): Promise<{ ok: true; document: KnowledgeDocument } | { ok: false; error: string }> {
  if (file.size > MAX_PREVIEW_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `"${file.name}" exceeds the 5 MB browser preview limit. No server upload is available in Phase 1.`,
    };
  }

  const docType = detectDocType(file.name);
  let previewContent = '';

  if (docType === 'pdf') {
    previewContent =
      `Binary PDF metadata preview:\n` +
      `File name: ${file.name}\n` +
      `Size: ${file.size} bytes\n\n` +
      `PDF text extraction and chunking are deferred to Phase 4 (Python backend).`;
  } else {
    try {
      const rawText = await file.text();
      previewContent = rawText.slice(0, 6000) || '(Empty text file)';
    } catch {
      return {
        ok: false,
        error: `Unable to read "${file.name}" as text in the browser.`,
      };
    }
  }

  const title = file.name.replace(/\.[^/.]+$/, '') || file.name;
  return {
    ok: true,
    document: {
      id: generateId('doc'),
      title,
      fileName: file.name,
      category: 'Browser Preview',
      fileType: docType,
      sizeBytes: file.size,
      addedAt: new Date().toISOString(),
      origin: 'browser-preview',
      summary:
        'Selected in browser for frontend preview only. Not indexed, chunked, or uploaded to a backend.',
      previewContent,
      indexingStatus: 'Local Preview Only (Unsynced)',
    },
  };
}

export async function readLocalFileForFileManagerPreview(
  file: File
): Promise<{ ok: true; fileItem: WorkspaceFile } | { ok: false; error: string }> {
  if (file.size > MAX_PREVIEW_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `"${file.name}" exceeds the 5 MB browser preview limit.`,
    };
  }

  const fileType = detectWorkspaceFileType(file.name, file.type);
  let previewText: string | undefined;

  if (['markdown', 'code', 'data', 'text'].includes(fileType)) {
    try {
      previewText = (await file.text()).slice(0, 4000);
    } catch {
      previewText = undefined;
    }
  }

  return {
    ok: true,
    fileItem: {
      id: generateId('file'),
      name: file.name,
      folder: '/browser-preview',
      fileType,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      modifiedAt: new Date().toISOString(),
      origin: 'browser-preview',
      previewText,
    },
  };
}
