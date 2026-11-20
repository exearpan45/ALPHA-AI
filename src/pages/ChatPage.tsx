import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Edit2,
  MessageSquare,
  PanelLeft,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { buildSimulatedDemoReply } from '../services/workspaceService';
import { ChatMessage } from '../types/alpha';
import { formatRelativeTime, generateId } from '../utils/storage';

const PROMPT_SUGGESTIONS = [
  'How will Phase 2 FastAPI connect to this frontend?',
  'Explain the local-first privacy approach for documents.',
  'How will Personal Memory work with future models?',
];

const ChatPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    updateConversation,
    deleteConversation,
    requestConfirm,
    addToast,
    logActivity,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [draftInput, setDraftInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMobileThreads, setShowMobileThreads] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null;

  useEffect(() => {
    if (activeConversation) {
      setTitleDraft(activeConversation.title);
      setEditingTitle(false);
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length, isSimulating]);

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const handleSendMessage = (overrideText?: string) => {
    const content = (overrideText ?? draftInput).trim();
    if (!content || isSimulating) return;

    let targetId = activeConversation?.id;
    let shouldAutoRename = false;

    if (!targetId) {
      const created = createConversation(
        content.length > 42 ? `${content.slice(0, 42)}...` : content
      );
      targetId = created.id;
    } else if (
      activeConversation &&
      activeConversation.messages.length === 0 &&
      activeConversation.title === 'New Conversation'
    ) {
      shouldAutoRename = true;
    }

    const userMsg: ChatMessage = {
      id: generateId('msg'),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const nextTitle = shouldAutoRename
      ? content.length > 44
        ? `${content.slice(0, 44)}...`
        : content
      : undefined;

    updateConversation(targetId, (prev) => ({
      ...prev,
      title: nextTitle ?? prev.title,
      updatedAt: new Date().toISOString(),
      messages: [...prev.messages, userMsg],
    }));

    setDraftInput('');
    setIsSimulating(true);

    window.setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: generateId('msg'),
        role: 'assistant',
        content: buildSimulatedDemoReply(content),
        timestamp: new Date().toISOString(),
        isDemoResponse: true,
      };
      updateConversation(targetId!, (prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        messages: [...prev.messages, assistantMsg],
      }));
      setIsSimulating(false);
    }, 320);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveTitle = () => {
    if (!activeConversation) return;
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setTitleDraft(activeConversation.title);
      setEditingTitle(false);
      return;
    }
    updateConversation(activeConversation.id, (prev) => ({
      ...prev,
      title: trimmed,
      updatedAt: new Date().toISOString(),
    }));
    setEditingTitle(false);
    addToast({ title: 'Conversation title updated', variant: 'success' });
  };

  const handleClearMessages = () => {
    if (!activeConversation) return;
    requestConfirm({
      title: 'Clear conversation messages?',
      message: `This will remove all ${activeConversation.messages.length} messages from "${activeConversation.title}" in browser storage.`,
      confirmLabel: 'Clear Messages',
      destructive: true,
      onConfirm: () => {
        updateConversation(activeConversation.id, (prev) => ({
          ...prev,
          messages: [],
          updatedAt: new Date().toISOString(),
        }));
        logActivity('Cleared demo chat thread', activeConversation.title, 'chat');
        addToast({ title: 'Conversation cleared', variant: 'info' });
      },
    });
  };

  const handleDeleteConversation = (id: string, title: string) => {
    requestConfirm({
      title: 'Delete conversation?',
      message: `Remove "${title}" from browser-local storage? This action cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteConversation(id),
    });
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      addToast({ title: 'Message copied to clipboard', variant: 'success' });
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      addToast({ title: 'Clipboard unavailable in this browser context', variant: 'error' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[540px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white lg:flex-row dark:border-slate-800 dark:bg-slate-900">
      {/* Left Conversation List */}
      <aside
        className={`${
          showMobileThreads ? 'flex' : 'hidden'
        } w-full flex-col border-b border-slate-200 lg:flex lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0 dark:border-slate-800`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-3.5 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Conversations ({conversations.length})
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              createConversation('New Conversation');
              setShowMobileThreads(false);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </Button>
        </div>

        <div className="border-b border-slate-100 p-3 dark:border-slate-800">
          <label htmlFor="chat-thread-search" className="sr-only">
            Search conversations
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              id="chat-thread-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threads..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching conversations.
            </p>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 transition-colors ${
                    isSelected
                      ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setShowMobileThreads(false);
                    }}
                    className="min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <p className="truncate text-sm font-medium">{conv.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {formatRelativeTime(conv.updatedAt)} · {conv.messages.length} msgs
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteConversation(conv.id, conv.title)}
                    aria-label={`Delete ${conv.title}`}
                    className="rounded p-1.5 text-slate-400 opacity-70 hover:bg-slate-200/70 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100 dark:hover:bg-slate-700 dark:hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Chat Panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6 dark:border-slate-800">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowMobileThreads((prev) => !prev)}
              aria-label="Toggle conversations list"
              className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            {activeConversation ? (
              editingTitle ? (
                <div className="flex flex-1 items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setEditingTitle(false);
                    }}
                    autoFocus
                    className="w-full rounded-lg border border-blue-500 bg-white px-2.5 py-1 text-sm font-medium text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-100"
                  />
                  <Button variant="primary" size="sm" onClick={handleSaveTitle}>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTitleDraft(activeConversation.title);
                      setEditingTitle(false);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
                    {activeConversation.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingTitle(true)}
                    aria-label="Edit conversation title"
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            ) : (
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No conversation selected
              </h2>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
              Simulated Demo Mode · No AI Model Connected
            </span>
            {activeConversation && activeConversation.messages.length > 0 && (
              <Button variant="secondary" size="sm" onClick={handleClearMessages}>
                Clear Thread
              </Button>
            )}
          </div>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Phase 1 Demonstration Chat"
                description="Messages sent here are stored locally in your browser and receive a simulated demonstration reply. Real local and cloud AI models arrive in Phase 3."
              />
              <div className="mt-6 space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Try a sample demonstration prompt
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {PROMPT_SUGGESTIONS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-blue-700 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {activeConversation.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {isUser ? 'You' : 'ALPHA AI'}
                      </span>
                      {!isUser && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Simulated Demo Reply</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {formatRelativeTime(msg.timestamp)}
                      </span>
                    </div>

                    <div
                      className={`group relative max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                        isUser
                          ? 'bg-slate-900 text-white dark:bg-blue-600'
                          : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                            isUser
                              ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                              : 'text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                          }`}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isSimulating && (
                <div className="flex flex-col items-start">
                  <span className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">
                    ALPHA AI · Generating demonstration response
                  </span>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400">
                    Preparing simulated Phase 1 reply...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Composer */}
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-2 focus-within:border-blue-500 focus-within:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:bg-slate-900">
              <textarea
                rows={2}
                value={draftInput}
                onChange={(e) => setDraftInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message to test the Phase 1 demo chat (Enter to send, Shift+Enter for new line)..."
                className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
              <Button
                variant="primary"
                onClick={() => handleSendMessage()}
                disabled={!draftInput.trim() || isSimulating}
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Demonstration mode: responses are generated locally without AI inference. Model selector arrives in Phase 3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
