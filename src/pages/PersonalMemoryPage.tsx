import React, { useState } from 'react';
import { Brain, Edit2, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { MemoryCategory, MemoryEntry } from '../types/alpha';
import { formatRelativeTime } from '../utils/storage';

const MEMORY_CATEGORIES: Array<'All' | MemoryCategory> = [
  'All',
  'Preferences',
  'Projects',
  'Technical',
  'Workflow',
  'Personal',
];

const PersonalMemoryPage: React.FC = () => {
  const {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    requestConfirm,
    addToast,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | MemoryCategory>('All');
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(
    memories[0]?.id ?? null
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MemoryEntry | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<MemoryCategory>('Preferences');
  const [formAllowContext, setFormAllowContext] = useState(true);
  const [formError, setFormError] = useState('');

  const filteredMemories = memories.filter((entry) => {
    const matchesCat =
      selectedCategory === 'All' || entry.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const selectedMemory =
    filteredMemories.find((m) => m.id === selectedMemoryId) ??
    filteredMemories[0] ??
    null;

  const openCreateModal = () => {
    setEditingEntry(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('Preferences');
    setFormAllowContext(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (entry: MemoryEntry) => {
    setEditingEntry(entry);
    setFormTitle(entry.title);
    setFormContent(entry.content);
    setFormCategory(entry.category);
    setFormAllowContext(entry.allowFutureContext);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      setFormError('Both a memory title and description are required.');
      return;
    }

    if (editingEntry) {
      updateMemory(editingEntry.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        allowFutureContext: formAllowContext,
      });
      addToast({ title: 'Memory entry updated', variant: 'success' });
    } else {
      addMemory({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        allowFutureContext: formAllowContext,
      });
    }
    setModalOpen(false);
  };

  const handleDeleteMemory = (entry: MemoryEntry) => {
    requestConfirm({
      title: 'Delete memory entry?',
      message: `Remove "${entry.title}" from browser-local memory?`,
      confirmLabel: 'Delete Memory',
      destructive: true,
      onConfirm: () => {
        deleteMemory(entry.id);
        if (selectedMemoryId === entry.id) {
          setSelectedMemoryId(null);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Honest Phase 1 Distinction */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-2xl space-y-1.5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Personal Memory Control
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage what ALPHA AI may reference as personal context. Entries below persist in
            browser localStorage for demonstration—no real AI memory engine is connected in Phase 1.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          <span>Add Demo Memory</span>
        </Button>
      </section>

      {/* Search & Category Tabs */}
      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memory entries..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
            />
          </div>
          <p className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {memories.filter((m) => m.allowFutureContext).length} of {memories.length} approved for future context
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {MEMORY_CATEGORIES.map((category) => {
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

      {/* Memory Cards + Detail View */}
      {filteredMemories.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="No memory entries found"
          description="Create a demonstration memory entry or clear your search filter to inspect saved entries."
          actionLabel="Add Demo Memory"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {filteredMemories.map((entry) => {
              const isSelected = selectedMemory?.id === entry.id;
              return (
                <div
                  key={entry.id}
                  className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-white shadow-xs dark:border-blue-500 dark:bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedMemoryId(entry.id)}
                    className="text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{entry.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {entry.origin === 'demo' ? 'Demo Seed' : 'Browser Local'}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {entry.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {entry.content}
                    </p>
                  </button>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {entry.allowFutureContext ? 'Context: Allowed' : 'Context: Paused'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(entry)}
                        aria-label={`Edit ${entry.title}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMemory(entry)}
                        aria-label={`Delete ${entry.title}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Memory Detail Inspector */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
            {selectedMemory ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedMemory.category} ·{' '}
                    {selectedMemory.origin === 'demo'
                      ? 'Demonstration Seed'
                      : 'User Browser Entry'}{' '}
                    · Updated {formatRelativeTime(selectedMemory.updatedAt)}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {selectedMemory.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedMemory.content}
                </p>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Future AI Context Permission
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Allow retrieval when Phase 3/4 is connected
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={selectedMemory.allowFutureContext}
                    onClick={() =>
                      updateMemory(selectedMemory.id, {
                        allowFutureContext: !selectedMemory.allowFutureContext,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      selectedMemory.allowFutureContext
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                        selectedMemory.allowFutureContext ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditModal(selectedMemory)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Entry</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMemory(selectedMemory)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-red-600 dark:text-red-400">Delete</span>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select a memory card to view details.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="memory-modal-title"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3
                id="memory-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {editingEntry ? 'Edit Memory Entry' : 'Add Browser Demo Memory'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="mt-4 space-y-4">
              {formError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {formError}
                </p>
              )}

              <div>
                <label
                  htmlFor="memory-title"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Title
                </label>
                <input
                  id="memory-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Preferred Python Formatter"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="memory-category"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Category
                </label>
                <select
                  id="memory-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {MEMORY_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="memory-content"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Memory Details
                </label>
                <textarea
                  id="memory-content"
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Describe the preference or personal fact..."
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formAllowContext}
                  onChange={(e) => setFormAllowContext(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Allow future AI context retrieval (Phase 3/4 permission)</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingEntry ? 'Save Changes' : 'Save Memory'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalMemoryPage;
