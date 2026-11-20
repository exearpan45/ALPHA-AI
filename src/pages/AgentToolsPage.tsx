import React, { useState } from 'react';
import { Sliders, Wrench, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { useWorkspace } from '../hooks/useWorkspace';
import { ToolCategory } from '../types/alpha';

const TOOL_CATEGORIES: Array<'All' | ToolCategory> = [
  'All',
  'Knowledge',
  'Files',
  'Computation',
  'Code',
  'Research',
  'System',
];

const AgentToolsPage: React.FC = () => {
  const { tools, updateTool, addToast } = useWorkspace();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ToolCategory>('All');
  const [configuringToolId, setConfiguringToolId] = useState<string | null>(null);

  const filteredTools = tools.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const configuringTool =
    tools.find((t) => t.id === configuringToolId) ?? null;

  const handleTogglePreference = (id: string, name: string, nextValue: boolean) => {
    updateTool(id, { preferenceEnabled: nextValue });
    addToast({
      title: `${name} preference ${nextValue ? 'enabled' : 'disabled'}`,
      description: 'Saved locally as a Phase 5 configuration preference. No live execution occurs in Phase 1.',
      variant: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Honest Phase 1 Constraint Notice */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-3xl space-y-1.5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Agent Tools Directory
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Configure future permission preferences for ALPHA AI agent capabilities. In Phase 1,
            all tool execution, system commands, and external lookups are disabled—toggles only
            store your intended preferences locally.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {TOOL_CATEGORIES.map((category) => {
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

      {/* Tool Cards */}
      {filteredTools.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No tools in this category"
          description="Select another category to view planned agent tools."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{tool.category}</span>
                  <span>Unavailable in Phase 1 · {tool.targetPhase}</span>
                </div>

                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {tool.preferenceEnabled
                      ? 'Preference: Enabled'
                      : 'Preference: Disabled'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={tool.preferenceEnabled}
                    aria-label={`Toggle preference for ${tool.name}`}
                    onClick={() =>
                      handleTogglePreference(tool.id, tool.name, !tool.preferenceEnabled)
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      tool.preferenceEnabled
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                        tool.preferenceEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {tool.requiresConfirmation
                      ? 'Requires confirmation'
                      : 'No prompt needed'}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfiguringToolId(tool.id)}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Configure</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Drawer Modal */}
      {configuringTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tool-config-title"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {configuringTool.category} · Planned {configuringTool.targetPhase}
                </p>
                <h3
                  id="tool-config-title"
                  className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  {configuringTool.name} — Configuration
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfiguringToolId(null)}
                aria-label="Close tool configuration"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Permission Scope
                </p>
                <p className="mt-1">{configuringTool.permissionScope}</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Status: Unavailable for live execution in Phase 1 (frontend-only release).
                </p>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3.5 text-sm dark:border-slate-800 cursor-pointer">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Require Confirmation Before Running
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Prompt owner before executing this tool in future phases
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={configuringTool.requiresConfirmation}
                  onChange={(e) =>
                    updateTool(configuringTool.id, {
                      requiresConfirmation: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3.5 text-sm dark:border-slate-800 cursor-pointer">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Local-Only Execution Mode
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restrict tool operations to local machine resources
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={configuringTool.localOnlyMode}
                  onChange={(e) =>
                    updateTool(configuringTool.id, {
                      localOnlyMode: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="primary" onClick={() => setConfiguringToolId(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentToolsPage;
