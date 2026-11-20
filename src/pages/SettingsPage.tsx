import React, { useState } from 'react';
import { Download, RotateCcw, Server } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  FutureModelPreference,
  InterfaceDensity,
  ThemeVariant,
} from '../types/alpha';
import { formatBytes, getAlphaStorageUsageBytes } from '../utils/storage';

const THEME_OPTIONS: Array<{ id: ThemeVariant; label: string; note: string }> = [
  { id: 'daylight', label: 'Pure Daylight', note: 'Crisp white & neutral slate (Default)' },
  { id: 'mist', label: 'Cool Mist', note: 'Soft cool gray workspace canvas' },
  { id: 'alabaster', label: 'Soft Alabaster', note: 'Subtle paper-toned background' },
  { id: 'dark', label: 'Slate Dark', note: 'Low-glare dark workspace mode' },
];

const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    addToast,
    requestConfirm,
    resetAllDemoData,
    exportBrowserDataJson,
  } = useWorkspace();

  const [ownerDraft, setOwnerDraft] = useState(settings.ownerName);
  const [workspaceDraft, setWorkspaceDraft] = useState(settings.workspaceName);
  const [backendUrlDraft, setBackendUrlDraft] = useState(settings.backendUrl);

  const storageStats = getAlphaStorageUsageBytes();

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ownerName: ownerDraft.trim() || 'Arpan Goswami',
      workspaceName: workspaceDraft.trim() || 'ALPHA AI',
    });
    addToast({ title: 'General preferences saved', variant: 'success' });
  };

  const handleSaveBackendPlaceholder = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ backendUrl: backendUrlDraft.trim() || 'http://localhost:8000' });
    addToast({
      title: 'Future backend endpoint saved',
      description: 'Phase 2 backend integration is not active yet.',
      variant: 'info',
    });
  };

  const handleTestBackendUnavailable = () => {
    addToast({
      title: 'Connection test unavailable in Phase 1',
      description: `Phase 1 is frontend-only. "${backendUrlDraft}" will be probed once the Phase 2 Python/FastAPI backend is added.`,
      variant: 'warning',
    });
  };

  const handleResetConfirm = () => {
    requestConfirm({
      title: 'Reset all browser demonstration data?',
      message:
        'This restores initial demonstration conversations, documents, memories, files, and default preferences in localStorage.',
      confirmLabel: 'Reset Data',
      destructive: true,
      onConfirm: () => {
        resetAllDemoData();
        setOwnerDraft('Arpan Goswami');
        setWorkspaceDraft('ALPHA AI');
        setBackendUrlDraft('http://localhost:8000');
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* General Settings */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <Avatar name={settings.ownerName} size="lg" />
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              General &amp; Owner Profile
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Personalize your local workspace identity
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="owner-name"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Project Owner Name
            </label>
            <input
              id="owner-name"
              type="text"
              value={ownerDraft}
              onChange={(e) => setOwnerDraft(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="workspace-name"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Workspace Title
            </label>
            <input
              id="workspace-name"
              type="text"
              value={workspaceDraft}
              onChange={(e) => setWorkspaceDraft(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit">
              Save General Settings
            </Button>
          </div>
        </form>
      </section>

      {/* Appearance & Theme */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Appearance &amp; Accessibility
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Active frontend theme and layout density preferences
          </p>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              Theme Selection
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {THEME_OPTIONS.map((option) => {
                const selected = settings.themeVariant === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      updateSettings({ themeVariant: option.id });
                      addToast({
                        title: `Theme switched to ${option.label}`,
                        variant: 'success',
                      });
                    }}
                    className={`rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-blue-600 bg-blue-50/40 dark:border-blue-500 dark:bg-blue-950/20'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {option.note}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="density-select"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Interface Density
              </label>
              <select
                id="density-select"
                value={settings.density}
                onChange={(e) =>
                  updateSettings({ density: e.target.value as InterfaceDensity })
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="comfortable">Comfortable (Recommended)</option>
                <option value="compact">Compact</option>
              </select>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-800 cursor-pointer">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Reduce Motion
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Disable page transition animations
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Model & Backend Preferences Placeholder */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Model &amp; Backend Preferences (Future Phases)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Configure intended Phase 2 backend URL and Phase 3 model routing preferences. No AI
            keys or live connections exist in Phase 1.
          </p>
        </div>

        <form onSubmit={handleSaveBackendPlaceholder} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="future-model-pref"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Preferred Model Architecture
              </label>
              <select
                id="future-model-pref"
                value={settings.futureModelPreference}
                onChange={(e) =>
                  updateSettings({
                    futureModelPreference: e.target.value as FutureModelPreference,
                  })
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="local-runtime">Local Models First (Phase 3)</option>
                <option value="cloud-optional">Optional Cloud Models (Phase 3)</option>
                <option value="undecided">Decide Later</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="backend-url"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Planned Backend URL (Phase 2)
              </label>
              <input
                id="backend-url"
                type="url"
                value={backendUrlDraft}
                onChange={(e) => setBackendUrlDraft(e.target.value)}
                placeholder="http://localhost:8000"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestBackendUnavailable}
            >
              <Server className="h-3.5 w-3.5" />
              <span>Test Backend Connection (Phase 2)</span>
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Endpoint Preference
            </Button>
          </div>
        </form>
      </section>

      {/* Privacy & Browser Storage */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Privacy &amp; Browser Storage
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            All Phase 1 data remains strictly on your device inside browser localStorage. Zero
            telemetry or external tracking is active.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <dl className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-800/50">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Storage Location</dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                Browser localStorage
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Active Keys</dt>
              <dd className="mt-1 font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {storageStats.keyCount} keys
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Estimated Usage</dt>
              <dd className="mt-1 font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {formatBytes(storageStats.totalBytes)}
              </dd>
            </div>
          </dl>

          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Persist Demonstration State in Browser
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save demo chats, memories, and previews across reloads
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.saveDemoDataLocally}
              onChange={(e) =>
                updateSettings({ saveDemoDataLocally: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button variant="secondary" size="sm" onClick={exportBrowserDataJson}>
              <Download className="h-3.5 w-3.5" />
              <span>Export Browser Snapshot (JSON)</span>
            </Button>

            <Button variant="secondary" size="sm" onClick={handleResetConfirm}>
              <RotateCcw className="h-3.5 w-3.5 text-red-600" />
              <span className="text-red-600 dark:text-red-400">Reset All Demo Data</span>
            </Button>
          </div>
        </div>
      </section>

      {/* About ALPHA AI */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          About ALPHA AI
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Version</dt>
            <dd className="mt-0.5 font-mono text-slate-900 dark:text-slate-100">
              1.0.0 · Phase 1 Frontend
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Project Owner</dt>
            <dd className="mt-0.5 text-slate-900 dark:text-slate-100">Arpan Goswami</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">License</dt>
            <dd className="mt-0.5 text-slate-900 dark:text-slate-100">MIT Open Source</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Development Roadmap</dt>
            <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
              Phase 1 (Active) → Phase 2 Backend → Phase 3 Models → Phase 4 RAG → Phase 5 Agents
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default SettingsPage;
