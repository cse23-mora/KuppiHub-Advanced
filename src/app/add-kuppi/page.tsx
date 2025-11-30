"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Types
interface LinkItem {
  id: string;
  url: string;
}

interface ModuleSearchResult {
  id: number;
  code: string;
  name: string;
  video_count: number;
}

interface FormData {
  moduleId: number | null;
  moduleCode: string;
  title: string;
  description: string;
  languageCode: string;
  indexNo: string;
  isKuppi: boolean;
  youtubeLinks: LinkItem[];
  telegramLinks: LinkItem[];
  gdriveLinks: LinkItem[];
  onedriveLinks: LinkItem[];
  materialLinks: LinkItem[];
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial form state
const initialFormData: FormData = {
  moduleId: null,
  moduleCode: "",
  title: "",
  description: "",
  languageCode: "si",
  indexNo: "",
  isKuppi: true,
  youtubeLinks: [{ id: generateId(), url: "" }],
  telegramLinks: [],
  gdriveLinks: [],
  onedriveLinks: [],
  materialLinks: [],
};

export default function AddKuppiPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Module search state
  const [moduleSearch, setModuleSearch] = useState("");
  const [moduleResults, setModuleResults] = useState<ModuleSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleSearchResult | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Search modules
  useEffect(() => {
    const searchModules = async () => {
      if (moduleSearch.length < 2) {
        setModuleResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/search-modules?q=${encodeURIComponent(moduleSearch)}`);
        const data = await res.json();
        setModuleResults(data.data || []);
      } catch (error) {
        console.error("Failed to search modules:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchModules, 300);
    return () => clearTimeout(debounce);
  }, [moduleSearch]);

  // Handle module selection
  const handleModuleSelect = (module: ModuleSearchResult) => {
    setSelectedModule(module);
    setFormData(prev => ({ ...prev, moduleId: module.id, moduleCode: module.code }));
    setModuleSearch(`${module.code} - ${module.name}`);
    setShowModuleDropdown(false);
  };

  // Add link to a category
  const addLink = (category: keyof Pick<FormData, "youtubeLinks" | "telegramLinks" | "gdriveLinks" | "onedriveLinks" | "materialLinks">) => {
    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], { id: generateId(), url: "" }],
    }));
  };

  // Remove link from a category
  const removeLink = (category: keyof Pick<FormData, "youtubeLinks" | "telegramLinks" | "gdriveLinks" | "onedriveLinks" | "materialLinks">, id: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter(link => link.id !== id),
    }));
  };

  // Update link URL
  const updateLink = (category: keyof Pick<FormData, "youtubeLinks" | "telegramLinks" | "gdriveLinks" | "onedriveLinks" | "materialLinks">, id: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].map(link => link.id === id ? { ...link, url } : link),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    // Validation
    if (!formData.moduleId) {
      setSubmitStatus({ type: "error", message: "Please select a module" });
      return;
    }
    if (!formData.title.trim()) {
      setSubmitStatus({ type: "error", message: "Please enter a title" });
      return;
    }
    if (!formData.description.trim()) {
      setSubmitStatus({ type: "error", message: "Please enter a description" });
      return;
    }

    // Filter out empty links
    const youtubeLinks = formData.youtubeLinks.filter(l => l.url.trim()).map(l => l.url.trim());
    const telegramLinks = formData.telegramLinks.filter(l => l.url.trim()).map(l => l.url.trim());
    const gdriveLinks = formData.gdriveLinks.filter(l => l.url.trim()).map(l => l.url.trim());
    const onedriveLinks = formData.onedriveLinks.filter(l => l.url.trim()).map(l => l.url.trim());
    const materialLinks = formData.materialLinks.filter(l => l.url.trim()).map(l => l.url.trim());

    // Must have at least one link
    if (youtubeLinks.length === 0 && telegramLinks.length === 0 && gdriveLinks.length === 0 && onedriveLinks.length === 0 && materialLinks.length === 0) {
      setSubmitStatus({ type: "error", message: "Please add at least one video or material link" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/add-kuppi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: formData.moduleId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          language_code: formData.languageCode,
          index_no: formData.indexNo.trim() || null,
          is_kuppi: formData.isKuppi,
          youtube_links: youtubeLinks,
          telegram_links: telegramLinks.length > 0 ? telegramLinks : null,
          gdrive_cloud_video_urls: gdriveLinks.length > 0 ? gdriveLinks : null,
          onedrive_cloud_video_urls: onedriveLinks.length > 0 ? onedriveLinks : null,
          material_urls: materialLinks.length > 0 ? materialLinks : null,
          firebase_uid: user?.uid, // Track who added this kuppi
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      setSubmitStatus({ type: "success", message: "Your Kuppi has been submitted successfully! It will be reviewed and published soon." });
      setFormData(initialFormData);
      setSelectedModule(null);
      setModuleSearch("");
    } catch (error) {
      setSubmitStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Add New Kuppi
            </span>
          </h1>
          <p className="text-gray-600">Share your knowledge with fellow students</p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How to upload your Kuppi:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Upload your video/materials to <a href="https://t.me/KuppihubBot" target="_blank" rel="noopener noreferrer" className="font-semibold underline">@KuppihubBot</a> on Telegram</li>
                <li>Or upload to YouTube, Google Drive, or OneDrive</li>
                <li>Copy the share links and paste them below</li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Status Messages */}
          <AnimatePresence>
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg ${
                  submitStatus.type === "success" 
                    ? "bg-green-50 border border-green-200 text-green-800" 
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Module Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Code / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={moduleSearch}
              onChange={(e) => {
                setModuleSearch(e.target.value);
                setShowModuleDropdown(true);
                if (!e.target.value) {
                  setSelectedModule(null);
                  setFormData(prev => ({ ...prev, moduleId: null, moduleCode: "" }));
                }
              }}
              onFocus={() => setShowModuleDropdown(true)}
              placeholder="Search for module (e.g., CS1032 or Data Structures)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-10">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
            
            {/* Dropdown */}
            {showModuleDropdown && moduleResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {moduleResults.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => handleModuleSelect(module)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-blue-600">{module.code}</span>
                      <span className="text-gray-600 ml-2">{module.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{module.video_count} videos</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.isKuppi}
                  onChange={() => setFormData(prev => ({ ...prev, isKuppi: true }))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Kuppi Video</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!formData.isKuppi}
                  onChange={() => setFormData(prev => ({ ...prev, isKuppi: false }))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Notes / Papers / Materials</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Data Structures - Linked Lists Explained"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this kuppi covers, topics included, etc."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.languageCode}
              onChange={(e) => setFormData(prev => ({ ...prev, languageCode: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="si">Sinhala</option>
              <option value="ta">Tamil</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Index Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Index Number <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.indexNo}
              onChange={(e) => setFormData(prev => ({ ...prev, indexNo: e.target.value }))}
              placeholder="e.g., 210001A"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used only to link your kuppis to your profile. Never displayed publicly.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Video & Material Links</h3>
            <p className="text-sm text-gray-500 mb-4">Add at least one link. You can add multiple links of each type.</p>
          </div>

          {/* YouTube Links */}
          <LinkSection
            title="YouTube Links"
            icon={<YoutubeIcon />}
            links={formData.youtubeLinks}
            onAdd={() => addLink("youtubeLinks")}
            onRemove={(id) => removeLink("youtubeLinks", id)}
            onUpdate={(id, url) => updateLink("youtubeLinks", id, url)}
            placeholder="https://www.youtube.com/watch?v=..."
            color="red"
          />

          {/* Telegram Links */}
          <LinkSection
            title="Telegram Links"
            icon={<TelegramIcon />}
            links={formData.telegramLinks}
            onAdd={() => addLink("telegramLinks")}
            onRemove={(id) => removeLink("telegramLinks", id)}
            onUpdate={(id, url) => updateLink("telegramLinks", id, url)}
            placeholder="https://t.me/..."
            color="blue"
          />

          {/* Google Drive Links */}
          <LinkSection
            title="Google Drive Links"
            icon={<GDriveIcon />}
            links={formData.gdriveLinks}
            onAdd={() => addLink("gdriveLinks")}
            onRemove={(id) => removeLink("gdriveLinks", id)}
            onUpdate={(id, url) => updateLink("gdriveLinks", id, url)}
            placeholder="https://drive.google.com/..."
            color="green"
          />

          {/* OneDrive Links */}
          <LinkSection
            title="OneDrive Links"
            icon={<OnedriveIcon />}
            links={formData.onedriveLinks}
            onAdd={() => addLink("onedriveLinks")}
            onRemove={(id) => removeLink("onedriveLinks", id)}
            onUpdate={(id, url) => updateLink("onedriveLinks", id, url)}
            placeholder="https://onedrive.live.com/..."
            color="sky"
          />

          {/* Material/PDF Links */}
          <LinkSection
            title="Material Links (PDF, Docs, etc.)"
            icon={<MaterialIcon />}
            links={formData.materialLinks}
            onAdd={() => addLink("materialLinks")}
            onRemove={(id) => removeLink("materialLinks", id)}
            onUpdate={(id, url) => updateLink("materialLinks", id, url)}
            placeholder="Direct link to PDF or document"
            color="gray"
          />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold 
                       rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Submit Kuppi</span>
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Link Section Component
interface LinkSectionProps {
  title: string;
  icon: React.ReactNode;
  links: LinkItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, url: string) => void;
  placeholder: string;
  color: string;
}

function LinkSection({ title, icon, links, onAdd, onRemove, onUpdate, placeholder, color }: LinkSectionProps) {
  const colorClasses: Record<string, string> = {
    red: "border-red-200 bg-red-50",
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    sky: "border-sky-200 bg-sky-50",
    gray: "border-gray-200 bg-gray-50",
  };

  const buttonColorClasses: Record<string, string> = {
    red: "text-red-600 hover:bg-red-100",
    blue: "text-blue-600 hover:bg-blue-100",
    green: "text-green-600 hover:bg-green-100",
    sky: "text-sky-600 hover:bg-sky-100",
    gray: "text-gray-600 hover:bg-gray-100",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className={`px-3 py-1 text-sm font-medium rounded-lg ${buttonColorClasses[color]} transition-colors`}
        >
          + Add Link
        </button>
      </div>
      
      <div className="space-y-2">
        {links.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No links added yet. Click &quot;Add Link&quot; to add one.</p>
        ) : (
          links.map((link, index) => (
            <div key={link.id} className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-6">{index + 1}.</span>
              <input
                type="url"
                value={link.url}
                onChange={(e) => onUpdate(link.id, e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => onRemove(link.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Icons
function YoutubeIcon() {
  return (
    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a2.974 2.974 0 0 0-2.094-2.103C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.404.583a2.974 2.974 0 0 0-2.094 2.103C0 8.09 0 12 0 12s0 3.91.502 5.814a2.974 2.974 0 0 0 2.094 2.103C4.495 20.5 12 20.5 12 20.5s7.505 0 9.404-.583a2.974 2.974 0 0 0 2.094-2.103C24 15.91 24 12 24 12s0-3.91-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function GDriveIcon() {
  return (
    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.433 22l3.088-5.333H22l-3.088 5.333H4.433zm7.134-12L7.6 2h7.467l3.967 8H11.567zm-1.7 2.933L2 22l3.967-6.867L13.833 2l3.967 6.867-7.966 4.066z" />
    </svg>
  );
}

function OnedriveIcon() {
  return (
    <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.085 6.013c2.32 0 4.258 1.587 4.817 3.738.258-.05.526-.076.802-.076 2.088 0 3.784 1.696 3.784 3.784 0 2.089-1.696 3.784-3.784 3.784H6.013c-2.088 0-3.784-1.695-3.784-3.784 0-1.77 1.217-3.254 2.86-3.667.107-2.278 1.987-4.106 4.296-4.106l.7.327z"/>
    </svg>
  );
}

function MaterialIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}
