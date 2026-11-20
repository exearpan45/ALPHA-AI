import React, { Suspense, lazy } from 'react';
import { LoadingSkeleton } from './components/ui/States';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { useWorkspace } from './hooks/useWorkspace';
import { AppLayout } from './layouts/AppLayout';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const KnowledgeCenterPage = lazy(() => import('./pages/KnowledgeCenterPage'));
const PersonalMemoryPage = lazy(() => import('./pages/PersonalMemoryPage'));
const FileManagerPage = lazy(() => import('./pages/FileManagerPage'));
const AgentToolsPage = lazy(() => import('./pages/AgentToolsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const WorkspaceViewRouter: React.FC = () => {
  const { activeSection } = useWorkspace();

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <ChatPage />;
      case 'knowledge':
        return <KnowledgeCenterPage />;
      case 'memory':
        return <PersonalMemoryPage />;
      case 'files':
        return <FileManagerPage />;
      case 'tools':
        return <AgentToolsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Suspense fallback={<LoadingSkeleton rows={5} />}>
      {renderSection()}
    </Suspense>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppLayout>
        <WorkspaceViewRouter />
      </AppLayout>
    </WorkspaceProvider>
  );
}
