"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Module {
  module_id: number;
  module: {
    id: number;
    code: string;
    name: string;
    description?: string;
  };
  video_count?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HierarchyData = any;

interface ModuleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (module: Module) => void;
  addedModuleIds: Set<number>;
}

export default function ModuleSelector({
  isOpen,
  onClose,
  onAddModule,
  addedModuleIds,
}: ModuleSelectorProps) {
  const [hierarchy, setHierarchy] = useState<HierarchyData | null>(null);
  const [loadingHierarchy, setLoadingHierarchy] = useState(true);
  const [selections, setSelections] = useState<string[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // Fetch hierarchy on mount
  useEffect(() => {
    if (isOpen && !hierarchy) {
      fetchHierarchy();
    }
  }, [isOpen, hierarchy]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSelections([]);
      setModules([]);
    }
  }, [isOpen]);

  const fetchHierarchy = async () => {
    setLoadingHierarchy(true);
    try {
      const res = await fetch("/api/hierarchy");
      if (res.ok) {
        const data = await res.json();
        setHierarchy(data);
      }
    } catch (err) {
      console.error("Failed to fetch hierarchy:", err);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  // Navigate through the hierarchy based on current selections
  const getCurrentNode = useCallback(() => {
    if (!hierarchy) return null;
    
    let node = hierarchy;
    
    for (const sel of selections) {
      if (node.children && node.children[sel]) {
        node = node.children[sel];
      } else if (node[sel]) {
        node = node[sel];
      } else {
        return null;
      }
    }
    
    return node;
  }, [hierarchy, selections]);

  // Get current options to display
  const getCurrentOptions = useCallback((): { id: string; name: string; icon?: string }[] => {
    if (!hierarchy) return [];
    
    if (selections.length === 0) {
      // Root level - show faculties
      return Object.entries(hierarchy).map(([id, node]: [string, HierarchyData]) => ({
        id,
        name: node.name,
        icon: node.icon,
      }));
    }
    
    const currentNode = getCurrentNode();
    if (!currentNode || !currentNode.children) return [];
    
    return Object.entries(currentNode.children).map(([id, node]: [string, HierarchyData]) => ({
      id,
      name: node.name,
      icon: node.icon,
    }));
  }, [hierarchy, selections, getCurrentNode]);

  // Get the current level label
  const getCurrentLevelLabel = useCallback((): string => {
    if (!hierarchy || selections.length === 0) return "Faculty";
    
    // Get the faculty node (first selection)
    const facultyNode = hierarchy[selections[0]];
    if (facultyNode && facultyNode.levels) {
      const levelIndex = selections.length - 1;
      if (levelIndex < facultyNode.levels.length) {
        return facultyNode.levels[levelIndex];
      }
    }
    
    return "Selection";
  }, [hierarchy, selections]);

  // Check if current node has modules (final level)
  const hasModules = useCallback((): boolean => {
    const currentNode = getCurrentNode();
    return currentNode !== null && Array.isArray(currentNode.modules);
  }, [getCurrentNode]);

  // Fetch modules when we reach a node with modules
  useEffect(() => {
    const fetchModulesForNode = async () => {
      const currentNode = getCurrentNode();
      if (currentNode && currentNode.modules && currentNode.modules.length > 0) {
        setLoadingModules(true);
        try {
          const ids = currentNode.modules.join(",");
          const res = await fetch(`/api/modules-by-ids?ids=${ids}`);
          if (res.ok) {
            const data = await res.json();
            setModules(data);
          }
        } catch (err) {
          console.error("Failed to fetch modules:", err);
        } finally {
          setLoadingModules(false);
        }
      }
    };
    
    if (hasModules()) {
      fetchModulesForNode();
    } else {
      setModules([]);
    }
  }, [selections, getCurrentNode, hasModules]);

  // Get breadcrumb trail
  const getBreadcrumb = useCallback((): { id: string; name: string }[] => {
    if (!hierarchy) return [];
    
    const trail: { id: string; name: string }[] = [];
    let node = hierarchy;
    
    for (const sel of selections) {
      if (node.children && node.children[sel]) {
        trail.push({ id: sel, name: node.children[sel].name });
        node = node.children[sel];
      } else if (node[sel]) {
        trail.push({ id: sel, name: node[sel].name });
        node = node[sel];
      }
    }
    
    return trail;
  }, [hierarchy, selections]);

  const handleSelect = (id: string) => {
    setSelections((prev) => [...prev, id]);
  };

  const handleBack = () => {
    if (selections.length > 0) {
      setSelections((prev) => prev.slice(0, -1));
      setModules([]);
    }
  };

  const currentOptions = getCurrentOptions();
  const breadcrumb = getBreadcrumb();
  const showModules = hasModules();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden sm:mx-4"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {selections.length > 0 && (
                <button onClick={handleBack} className="p-1.5 sm:p-1 hover:bg-white/20 rounded-lg active:bg-white/30">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="text-base sm:text-xl font-bold">Add Modules</h2>
            </div>
            <button onClick={onClose} className="p-1.5 sm:p-1 hover:bg-white/20 rounded-lg active:bg-white/30">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <div className="mt-2 text-xs sm:text-sm text-blue-100 flex items-center flex-wrap gap-1 overflow-x-auto">
              {breadcrumb.map((item, index) => (
                <span key={item.id} className="flex items-center whitespace-nowrap">
                  {index > 0 && <span className="mx-1">→</span>}
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] sm:max-h-[60vh]">
          {loadingHierarchy ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Options Selection */}
              {!showModules && currentOptions.length > 0 && (
                <motion.div
                  key={`level-${selections.length}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Select {selections.length === 0 ? "Faculty" : getCurrentLevelLabel()}
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    {currentOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all text-left"
                      >
                        {opt.icon && <span className="text-xl sm:text-2xl">{opt.icon}</span>}
                        <span className="font-medium text-gray-800 text-sm sm:text-base">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Modules List */}
              {showModules && (
                <motion.div
                  key="modules"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Select Modules</h3>

                  {loadingModules ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : modules.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <p className="text-sm sm:text-base">No modules found for this selection.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {modules.map((m) => {
                        const isAdded = addedModuleIds.has(m.module_id);
                        return (
                          <div
                            key={m.module_id}
                            className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-xl"
                          >
                            <div className="flex-1 min-w-0 mr-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-blue-600 text-sm sm:text-base">{m.module.code}</span>
                                {m.video_count !== undefined && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {m.video_count} videos
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700 text-sm truncate">{m.module.name}</p>
                            </div>
                            <button
                              onClick={() => onAddModule(m)}
                              disabled={isAdded}
                              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isAdded
                                  ? "bg-green-100 text-green-600 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                              }`}
                            >
                              {isAdded ? "✓" : "+ Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            {showModules
              ? `${modules.length} modules found`
              : `Step ${selections.length + 1}`}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
