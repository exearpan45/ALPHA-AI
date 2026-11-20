import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  FolderOpen,
  MessageSquare,
  Plus,
  Settings,
  Wrench,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { formatRelativeTime } from '../utils/storage';

const DashboardPage: React.FC = () => {
  const {
    settings,
    conversations,
    knowledgeDocs,
    memories,
    files,
    tools,
    activityLogs,
    setActiveSection,
    createConversation,
    openConversationInChat,
  } = useWorkspace();

  const configuredToolsCount = tools.filter((t) => t.preferenceEnabled).length;
  const recentConversations = conversations.slice(0, 4);
  const recentActivity = activityLogs.slice(0, 5);

  const handleStartNewChat = () => {
    createConversation('New Conversation');
    setActiveSection('chat');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Personal AI Workspace · Phase 1 Demonstration Release
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100 [text-wrap:balance]">
            Welcome back, {settings.ownerName.split(' ')[0]}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            All metrics, conversations, and files shown here run locally in your browser using
            demonstration data. No backend server or external AI model is connected in Phase 1.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button variant="secondary" onClick={() => setActiveSection('knowledge')}>
            Preview a File
          </Button>
          <Button variant="primary" onClick={handleStartNewChat}>
            <Plus className="h-4 w-4" />
            <span>Start Demo Chat</span>
          </Button>
        </div>
      </section>

      {/* 4-Column Workspace Statistics (Demonstration Data) */}
      <section aria-labelledby="stats-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h3
            id="stats-heading"
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Workspace Overview
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Demonstration &amp; browser-local counts
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveSection('chat')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Conversations</span>
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {conversations.length}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Browser-local demo threads
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('knowledge')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Knowledge Items</span>
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {knowledgeDocs.length}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Unindexed preview entries
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('memory')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Memory Entries</span>
              <Brain className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {memories.length}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {memories.filter((m) => m.allowFutureContext).length} marked for future context
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('tools')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Tool Preferences</span>
              <Wrench className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {configuredToolsCount} / {tools.length}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Execution disabled in Phase 1
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <h3
          id="quick-actions-heading"
          className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={handleStartNewChat}
            className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 cursor-pointer"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                New Demo Conversation
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Test simulated chat layout and browser persistence.
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('knowledge')}
            className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 cursor-pointer"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Inspect Knowledge Base
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Preview local text or markdown files in-browser.
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('memory')}
            className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 cursor-pointer"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Manage Personal Memory
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Create, edit, and control future context entries.
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('files')}
            className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 cursor-pointer"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Browse Workspace Files
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                View {files.length} local demo and preview files.
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </button>
        </div>
      </section>

      {/* Main Split: Recent Conversations + Activity & System Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Conversations */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Recent Conversations
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Demonstration threads stored locally in your browser
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('history')}>
              View History
            </Button>
          </div>

          {recentConversations.length === 0 ? (
            <div className="pt-6">
              <EmptyState
                icon={MessageSquare}
                title="No conversations yet"
                description="Start a new demonstration thread to explore the chat interface."
                actionLabel="Start Demo Chat"
                onAction={handleStartNewChat}
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentConversations.map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => openConversationInChat(conv.id)}
                      className="flex w-full items-start justify-between gap-4 py-3.5 text-left transition-colors hover:bg-slate-50/80 px-2 -mx-2 rounded-lg dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {conv.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {lastMessage
                            ? lastMessage.content
                            : 'Empty conversation thread'}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                          {formatRelativeTime(conv.updatedAt)}
                        </span>
                        <p className="mt-1 font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                          {conv.messages.length} msgs
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Model Status Placeholder + Recent Activity */}
        <div className="space-y-6 lg:col-span-5">
          {/* Model Status Placeholder */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Runtime &amp; Model Placeholder
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('settings')}>
                <Settings className="h-3.5 w-3.5" />
                <span>Configure</span>
              </Button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">AI Inference</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  Not Connected (Phase 3)
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Backend API</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  Not Connected (Phase 2)
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Preferred Path</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  {settings.futureModelPreference === 'local-runtime'
                    ? 'Local Runtime First'
                    : settings.futureModelPreference === 'cloud-optional'
                      ? 'Optional Cloud API'
                      : 'Undecided'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Current Storage</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  Browser localStorage
                </dd>
              </div>
            </dl>
          </section>

          {/* Recent Activity */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b border-slate-100 pb-4 text-base font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
              Recent Activity
            </h3>
            <ul className="mt-4 space-y-3.5">
              {recentActivity.map((event) => (
                <li key={event.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {event.detail}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                    {formatRelativeTime(event.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Navigation Shortcuts Footer Strip */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Jump directly to workspace modules
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('chat')}>
              <MessageSquare className="h-3.5 w-3.5" />
              <span>AI Chat</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('knowledge')}>
              <BookOpen className="h-3.5 w-3.5" />
              <span>Knowledge</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('memory')}>
              <Brain className="h-3.5 w-3.5" />
              <span>Memory</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('files')}>
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Files</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('tools')}>
              <Wrench className="h-3.5 w-3.5" />
              <span>Tools</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('history')}>
              <Clock className="h-3.5 w-3.5" />
              <span>History</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
