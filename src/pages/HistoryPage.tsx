import React, { useState } from 'react';
import {
  Check,
  Clock,
  Edit2,
  MessageSquare,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { Conversation } from '../types/alpha';
import { DateGroupLabel, formatRelativeTime, getDateGroup } from '../utils/storage';

const GROUP_ORDER: DateGroupLabel[] = [
  'Today',
  'Yesterday',
  'Previous 7 Days',
  'Older',
];

const HistoryPage: React.FC = () => {
  const {
    conversations,
    openConversationInChat,
    updateConversation,
    deleteConversation,
    clearAllConversations,
    requestConfirm,
    addToast,
    createConversation,
    setActiveSection,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      conv.title.toLowerCase().includes(q) ||
      conv.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const grouped = GROUP_ORDER.reduce<Record<DateGroupLabel, Conversation[]>>(
    (acc, label) => {
      acc[label] = [];
      return acc;
    },
    {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: [],
    }
  );

  filteredConversations.forEach((conv) => {
    const group = getDateGroup(conv.updatedAt);
    grouped[group].push(conv);
  });

  const startRename = (conv: Conversation) => {
    setRenamingId(conv.id);
    setRenameDraft(conv.title);
  };

  const commitRename = (id: string) => {
    const trimmed = renameDraft.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    updateConversation(id, (prev) => ({
      ...prev,
      title: trimmed,
      updatedAt: new Date().toISOString(),
    }));
    setRenamingId(null);
    addToast({ title: 'Conversation renamed', variant: 'success' });
  };

  const handleDelete = (conv: Conversation) => {
    requestConfirm({
      title: 'Delete conversation?',
      message: `Remove "${conv.title}" from browser-local history?`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteConversation(conv.id),
    });
  };

  const handleClearAll = () => {
    requestConfirm({
      title: 'Clear all conversation history?',
      message: `This will permanently remove all ${conversations.length} conversations from browser storage.`,
      confirmLabel: 'Clear All History',
      destructive: true,
      onConfirm: clearAllConversations,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Conversation History
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Browse, rename, and manage browser-local demonstration conversations grouped by date.
          </p>
        </div>

        {conversations.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
            <span>Clear All History</span>
          </Button>
        )}
      </section>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversation titles and messages..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Grouped History List */}
      {filteredConversations.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={conversations.length === 0 ? 'No conversation history' : 'No matching conversations'}
          description={
            conversations.length === 0
              ? 'Start a demonstration chat to build your local conversation history.'
              : 'Try a different search term to locate a previous thread.'
          }
          actionLabel="Start Demo Chat"
          onAction={() => {
            createConversation('New Conversation');
            setActiveSection('chat');
          }}
        />
      ) : (
        <div className="space-y-6">
          {GROUP_ORDER.map((groupLabel) => {
            const items = grouped[groupLabel];
            if (items.length === 0) return null;
            return (
              <section key={groupLabel} className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {groupLabel} ({items.length})
                </h3>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                  {items.map((conv) => {
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    const isRenaming = renamingId === conv.id;
                    return (
                      <div
                        key={conv.id}
                        className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          {isRenaming ? (
                            <div className="flex items-center gap-2 max-w-md">
                              <input
                                type="text"
                                value={renameDraft}
                                onChange={(e) => setRenameDraft(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') commitRename(conv.id);
                                  if (e.key === 'Escape') setRenamingId(null);
                                }}
                                autoFocus
                                className="w-full rounded-lg border border-blue-500 bg-white px-2.5 py-1 text-sm font-medium text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-100"
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => commitRename(conv.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRenamingId(null)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {conv.title}
                              </p>
                              <p className="mt-1 line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
                                {lastMsg
                                  ? lastMsg.content
                                  : 'Empty conversation thread'}
                              </p>
                              <p className="mt-1.5 font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                                {formatRelativeTime(conv.updatedAt)} · {conv.messages.length}{' '}
                                messages · {conv.isDemoSeed ? 'Demo Seed' : 'Browser Local'}
                              </p>
                            </>
                          )}
                        </div>

                        {!isRenaming && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openConversationInChat(conv.id)}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Open</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startRename(conv)}
                              aria-label={`Rename ${conv.title}`}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              <span>Rename</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(conv)}
                              aria-label={`Delete ${conv.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
