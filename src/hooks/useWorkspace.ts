import { useContext } from 'react';
import { WorkspaceContext, WorkspaceContextValue } from '../context/WorkspaceContext';

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
}
