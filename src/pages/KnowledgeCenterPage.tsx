import React, { useRef, useState } from 'react';
import {
  BookOpen,
  FileCode,
  FileSpreadsheet,
  FileText,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { readLocalFileForKnowledgePreview } from '../services/workspaceService';
import { DocumentFileType, KnowledgeCategory } from '../types/alpha';
import { formatBytes, formatRelativeTime } from '../utils/storage';

const CATEGORIES: Array<'All' | KnowledgeCategory> = [
  'All',
  'Architecture',
  'Research',
  'Notes',
  'Code',
  'Browser Preview',
];

const KnowledgeCenterPage: React.FC = () => {
  const {
    knowledgeDocs,
    addKnowledgeDoc,
    deleteKnowledgeDoc,
    requestConfirm,
    addToast,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | KnowledgeCategory>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | DocumentFileType>('all');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    knowledgeDocs[0]?.id ?? null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredDocs = knowledgeDocs.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesType = typeFilter === 'all' || doc.fileType === typeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q);
    return matchesCategory && matchesType && matchesSearch;
  });

  const selectedDoc =
    filteredDocs.find((d) => d.id === selectedDocId) ?? filteredDocs[0] ?? null;

  const handleFileSelection = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);
    setIsReadingFile(true);

    const file = fileList[0];
    const result = await readLocalFileForKnowledgePreview(file);
    setIsReadingFile(false);

    if (result.ok === false) {
      setUploadError(result.error);
      return;
    }

    addKnowledgeDoc(result.document);
    setSelectedDocId(result.document.id);
    setSelectedCategory('All');
    addToast({
      title: 'Local preview loaded',
      description: `${result.document.fileName} is previewed in-browser only (not indexed or uploaded).`,
      variant: 'info',
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = (id: string, title: string) => {
    requestConfirm({
      title: 'Remove document entry?',
      message: `Remove "${title}" from this browser-local knowledge view?`,
      confirmLabel: 'Remove',
      destructive: true,
      onConfirm: () => {
        deleteKnowledgeDoc(id);
        if (selectedDocId === id) {
          setSelectedDocId(null);
        }
      },
    });
  };

  const renderDocIcon = (type: DocumentFileType) => {
    if (type === 'code' || type === 'json') return FileCode;
    if (type === 'csv') return FileSpreadsheet;
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header & Honest Storage Notice */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-2xl space-y-1.5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Personal Knowledge Library
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Preview personal documents in-browser. In Phase 1, selected files are not indexed,
            chunked, embedded, or uploaded to a server—demo entries are explicitly labeled.
          </p>
        </div>

        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.markdown,.json,.csv,.pdf,.ts,.tsx,.js,.py"
            onChange={(e) => handleFileSelection(e.target.files)}
            className="hidden"
          />
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isReadingFile}
          >
            <Upload className="h-4 w-4" />
            <span>{isReadingFile ? 'Reading...' : 'Preview Local File'}</span>
          </Button>
        </div>
      </section>

      {uploadError && (
        <ErrorState
          title="File preview validation error"
          message={uploadError}
          onDismiss={() => setUploadError(null)}
        />
      )}

      {/* Search & Filter Toolbar */}
      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search demo documents and previews..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="knowledge-type-filter"
              className="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              Type:
            </label>
            <select
              id="knowledge-type-filter"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'all' | DocumentFileType)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All File Types</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
              <option value="text">Plain Text</option>
              <option value="csv">CSV</option>
              <option value="code">Code</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Document Library & Detail Inspector */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No matching documents"
          description="No demonstration or browser-preview documents match your current filters. Try clearing filters or previewing a local text file."
          actionLabel="Preview Local File"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Document List */}
          <div className="space-y-3 lg:col-span-5">
            {filteredDocs.map((doc) => {
              const Icon = renderDocIcon(doc.fileType);
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-white shadow-xs dark:border-blue-500 dark:bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDocId(doc.id)}
                      className="min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{doc.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase">{doc.fileType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{doc.origin === 'demo' ? 'Demo Entry' : 'Local Preview'}</span>
                      </div>
                      <h3 className="mt-1.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {doc.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {doc.summary}
                      </p>
                      <p className="mt-2 font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                        {doc.fileName} · {formatBytes(doc.sizeBytes)} ·{' '}
                        {formatRelativeTime(doc.addedAt)}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(doc.id, doc.title)}
                      aria-label={`Remove ${doc.title}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Inspector Panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            {selectedDoc ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{selectedDoc.origin === 'demo' ? 'Demonstration Document' : 'Browser File Preview'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedDoc.indexingStatus}</span>
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {selectedDoc.title}
                    </h3>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteDoc(selectedDoc.id, selectedDoc.title)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </Button>
                </div>

                <dl className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">File Name</dt>
                    <dd className="mt-1 truncate font-mono font-medium text-slate-900 dark:text-slate-100">
                      {selectedDoc.fileName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Size</dt>
                    <dd className="mt-1 font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      {formatBytes(selectedDoc.sizeBytes)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Category</dt>
                    <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                      {selectedDoc.category}
                    </dd>
                  </div>
                </dl>

                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Content Preview (Read-only in Phase 1)
                  </p>
                  <pre className="max-h-80 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                    {selectedDoc.previewContent}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select a document to inspect its preview.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCenterPage;
