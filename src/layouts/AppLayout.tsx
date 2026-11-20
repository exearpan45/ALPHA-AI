import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  Clock,
  FolderOpen,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  Wrench,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useWorkspace } from '../hooks/useWorkspace';
import { NavigationSection } from '../types/alpha';

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'knowledge', label: 'Knowledge Center', icon: BookOpen },
  { id: 'memory', label: 'Personal Memory', icon: Brain },
  { id: 'files', label: 'File Manager', icon: FolderOpen },
  { id: 'tools', label: 'Agent Tools', icon: Wrench },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeSection,
    setActiveSection,
    createConversation,
    settings,
    conversations,
    knowledgeDocs,
    memories,
  } = useWorkspace();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentNav = NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];

  const handleNavClick = (section: NavigationSection) => {
    setActiveSection(section);
    setMobileDrawerOpen(false);
  };

  const handleNewChat = () => {
    createConversation('New Conversation');
    setActiveSection('chat');
    setMobileDrawerOpen(false);
  };

  const getCountForSection = (id: NavigationSection): number | null => {
    if (id === 'chat' || id === 'history') return conversations.length;
    if (id === 'knowledge') return knowledgeDocs.length;
    if (id === 'memory') return memories.length;
    return null;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-slate-900">
      <div>
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-display text-xs font-bold tracking-tight text-white dark:bg-blue-600">
              A
            </span>
            <span className="font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap dark:text-slate-100">
              {settings.workspaceName}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pt-4 pb-2">
          <p className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Phase 1 · Frontend Workspace
          </p>
        </div>

        <nav aria-label="Primary navigation" className="space-y-1 px-3 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const count = getCountForSection(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex min-h-[42px] w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                </span>
                {count !== null && (
                  <span className="ml-2 font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-slate-800/70 cursor-pointer"
        >
          <Avatar name={settings.ownerName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {settings.ownerName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Browser-local mode
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex min-h-screen w-full text-slate-900 dark:text-slate-100"
      style={{ backgroundColor: 'var(--alpha-canvas)' }}
    >
      {/* Desktop Left Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 lg:block dark:border-slate-800">
        <div className="sticky top-0 h-screen overflow-y-auto">{sidebarContent}</div>
      </aside>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/40"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative z-50 h-full w-72 max-w-[85vw] border-r border-slate-200 shadow-xl dark:border-slate-800">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden font-medium text-slate-500 sm:inline whitespace-nowrap dark:text-slate-400">
                {settings.workspaceName}
              </span>
              <span
                aria-hidden="true"
                className="hidden text-slate-300 sm:inline dark:text-slate-700"
              >
                /
              </span>
              <h1 className="truncate font-display text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
                {currentNav.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button variant="primary" size="sm" onClick={handleNewChat}>
              <Plus className="h-3.5 w-3.5" />
              <span>New Demo Chat</span>
            </Button>
          </div>
        </header>

        <main
          className={`mx-auto w-full max-w-[1320px] flex-1 ${
            settings.density === 'compact' ? 'p-4 sm:p-5' : 'p-4 sm:p-6 lg:p-8'
          }`}
        >
          <motion.div
            key={activeSection}
            initial={settings.reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
};
