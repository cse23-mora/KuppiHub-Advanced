"use client";

import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import { ModuleSearchResult } from "./types";

interface ModuleSearchProps {
  value: string;
  selectedModule: ModuleSearchResult | null;
  onSearch: (value: string) => void;
  onSelect: (module: ModuleSearchResult) => void;
  onClear: () => void;
}

export default function ModuleSearch({
  value,
  selectedModule,
  onSearch,
  onSelect,
  onClear,
}: ModuleSearchProps) {
  const [results, setResults] = useState<ModuleSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search modules
  useEffect(() => {
    const searchModules = async () => {
      if (value.length < 2 || selectedModule) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/search-modules?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (error) {
        console.error("Failed to search modules:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchModules, 300);
    return () => clearTimeout(debounce);
  }, [value, selectedModule]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (module: ModuleSearchResult) => {
    onSelect(module);
    onSearch(`${module.code} - ${module.name}`);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <TextField
        fullWidth
        label="Module Code / Name"
        required
        size="small"
        value={value}
        onChange={(e) => {
          onSearch(e.target.value);
          setShowDropdown(true);
          if (!e.target.value) {
            onClear();
          }
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search for module (e.g., CS1032 or Data Structures)"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#9ca3af", fontSize: { xs: 18, sm: 20 } }} />
            </InputAdornment>
          ),
          endAdornment: isSearching ? (
            <InputAdornment position="end">
              <CircularProgress size={18} />
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        }}
      />
      
      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            mt: 0.5,
            borderRadius: 2,
            maxHeight: 240,
            overflow: "auto",
          }}
        >
          {results.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => handleSelect(module)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-blue-50 flex justify-between items-center border-b border-gray-100 last:border-0"
            >
              <div className="min-w-0">
                <span className="font-medium text-blue-600 text-sm sm:text-base">{module.code}</span>
                <span className="text-gray-600 ml-2 text-xs sm:text-sm truncate">{module.name}</span>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{module.video_count} videos</span>
            </button>
          ))}
        </Paper>
      )}
    </div>
  );
}
