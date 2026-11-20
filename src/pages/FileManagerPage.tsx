import React, { useRef, useState } from 'react';
import {
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  LayoutGrid,
  List,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { readLocalFileForFileManagerPreview } from '../services/workspaceService';
import { WorkspaceFileType } from '../types/alpha';
import { formatBytes, formatRelativeTime } from '../utils/storage';

type SortKey = 'modified' | 'name' | 'size';

const FileManagerPage: React.FC = () => {
  const { files, addWorkspaceFile, deleteWorkspaceFile, requestConfirm, addToast } =
    useWorkspace();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | WorkspaceFileType>('all');
  const [sortBy, setSortBy] = useState<SortKey>('modified');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(
    files[0]?.id ?? null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredFiles = files
    .filter((file) => {
      const matchesType = typeFilter === 'all' || file.fileType === typeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        file.name.toLowerCase().includes(q) ||
        file.folder.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
      return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
    });

  const selectedFile =
    filteredFiles.find((f) => f.id === selectedFileId) ?? filteredFiles[0] ?? null;

  const handleFileUploadPreview = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);
    const result = await readLocalFileForFileManagerPreview(fileList[0]);
    if (result.ok === false) {
      setUploadError(result.error);
      return;
    }
    addWorkspaceFile(result.fileItem);
    setSelectedFileId(result.fileItem.id);
    addToast({
      title: 'Added browser file preview',
      description: `${result.fileItem.name} is local to your browser session only.`,
      variant: 'info',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (id: string, name: string) => {
    requestConfirm({
      title: 'Remove file entry?',
      message: `Remove "${name}" from the Phase 1 demo file manager?`,
      confirmLabel: 'Remove File',
      destructive: true,
      onConfirm: () => {
        deleteWorkspaceFile(id);
        if (selectedFileId === id) {
          setSelectedFileId(null);
        }
      },
    });
  };

  const getFileIcon = (type: WorkspaceFileType) => {
    if (type === 'code') return FileCode;
    if (type === 'data') return FileSpreadsheet;
    if (type === 'image') return FileImage;
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-2xl space-y-1.5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Workspace File Manager
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Organize demonstration workspace files and inspect local file previews in-browser.
            No server uploads or local filesystem synchronization take place in Phase 1.
          </p>
        </div>
        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileUploadPreview(e.target.files)}
            className="hidden"
          />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            <span>Preview Local File</span>
          </Button>
        </div>
      </section>

      {uploadError && (
        <ErrorState
          title="File preview failed"
          message={uploadError}
          onDismiss={() => setUploadError(null)}
        />
      )}

      {/* Toolbar */}
      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by name or folder..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by file type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | WorkspaceFileType)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="markdown">Markdown</option>
            <option value="code">Code</option>
            <option value="data">Data (CSV)</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="text">Text</option>
          </select>

          <select
            aria-label="Sort files"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="modified">Sort: Modified</option>
            <option value="name">Sort: Name</option>
            <option value="size">Sort: Size</option>
          </select>

          <div
            className="flex items-center rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
            role="group"
            aria-label="File view mode"
          >
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No files match your filter"
          description="Try clearing your search or preview a local file from your device."
          actionLabel="Preview Local File"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Files List or Grid */}
          <div className="lg:col-span-8">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Folder</th>
                      <th className="px-4 py-3 font-medium text-right">Size</th>
                      <th className="px-4 py-3 font-medium text-right">Modified</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredFiles.map((file) => {
                      const Icon = getFileIcon(file.fileType);
                      const isSelected = selectedFile?.id === file.id;
                      return (
                        <tr
                          key={file.id}
                          onClick={() => setSelectedFileId(file.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/50 dark:bg-blue-950/20'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                                  {file.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {file.origin === 'demo' ? 'Demo Entry' : 'Browser Preview'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                            {file.folder}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
                            {formatBytes(file.sizeBytes)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                            {formatRelativeTime(file.modifiedAt)}
                          </td>
                          <td
                            className="px-4 py-3 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleDeleteFile(file.id, file.name)}
                              aria-label={`Remove ${file.name}`}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredFiles.map((file) => {
                  const Icon = getFileIcon(file.fileType);
                  const isSelected = selectedFile?.id === file.id;
                  return (
                    <div
                      key={file.id}
                      className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-white shadow-xs dark:border-blue-500 dark:bg-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedFileId(file.id)}
                        className="text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <Icon className="h-5 w-5" />
                          <span className="font-mono text-xs uppercase">
                            {file.fileType}
                          </span>
                        </div>
                        <p className="mt-3 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {file.name}
                        </p>
                        <p className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                          {file.folder} · {formatBytes(file.sizeBytes)}
                        </p>
                      </button>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <span>
                          {file.origin === 'demo' ? 'Demo File' : 'Browser Preview'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          aria-label={`Remove ${file.name}`}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* File Inspector */}
          <aside className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
            {selectedFile ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedFile.origin === 'demo'
                      ? 'Demonstration File'
                      : 'Browser Preview (Not Synced)'}
                  </p>
                  <h3 className="mt-1 break-all text-base font-semibold text-slate-900 dark:text-slate-100">
                    {selectedFile.name}
                  </h3>
                </div>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">Folder</dt>
                    <dd className="font-mono text-slate-900 dark:text-slate-100">
                      {selectedFile.folder}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">MIME Type</dt>
                    <dd className="font-mono text-slate-900 dark:text-slate-100">
                      {selectedFile.mimeType}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">Size</dt>
                    <dd className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {formatBytes(selectedFile.sizeBytes)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
                    <dd className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {formatRelativeTime(selectedFile.modifiedAt)}
                    </dd>
                  </div>
                </dl>

                {selectedFile.previewText ? (
                  <div className="pt-2">
                    <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Text Snippet
                    </p>
                    <pre className="max-h-56 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                      {selectedFile.previewText}
                    </pre>
                  </div>
                ) : (
                  <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    Binary or non-text file preview is not rendered in Phase 1.
                  </p>
                )}

                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteFile(selectedFile.id, selectedFile.name)}
                    className="w-full"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Entry</span>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select a file to inspect its metadata.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default FileManagerPage;
