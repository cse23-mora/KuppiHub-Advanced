"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloudIcon from "@mui/icons-material/Cloud";
import FolderIcon from "@mui/icons-material/Folder";
import { useState } from "react";
import { Kuppi, EditFormState, LinkCategory } from "./types";
import LinkEditor from "./LinkEditor";

interface EditDialogProps {
  kuppi: Kuppi | null;
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (form: EditFormState) => void;
}

export default function EditDialog({
  kuppi,
  open,
  saving,
  onClose,
  onSave,
}: EditDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [editTab, setEditTab] = useState(0);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    description: "",
    youtube_links: [],
    telegram_links: [],
    gdrive_cloud_video_urls: [],
    onedrive_cloud_video_urls: [],
    material_urls: [],
  });

  // Reset form when kuppi changes
  const handleEnter = () => {
    if (kuppi) {
      setEditForm({
        title: kuppi.title,
        description: kuppi.description,
        youtube_links: kuppi.youtube_links || [],
        telegram_links: kuppi.telegram_links || [],
        gdrive_cloud_video_urls: kuppi.gdrive_cloud_video_urls || [],
        onedrive_cloud_video_urls: kuppi.onedrive_cloud_video_urls || [],
        material_urls: kuppi.material_urls || [],
      });
      setEditTab(0);
    }
  };

  // Add link to a category
  const handleAddLink = (category: LinkCategory) => {
    setEditForm(prev => ({
      ...prev,
      [category]: [...prev[category], ""],
    }));
  };

  // Update link in a category
  const handleUpdateLink = (category: LinkCategory, index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [category]: prev[category].map((link, i) => i === index ? value : link),
    }));
  };

  // Remove link from a category
  const handleRemoveLink = (category: LinkCategory, index: number) => {
    setEditForm(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(editForm);
  };

  const cloudLinksCount = editForm.gdrive_cloud_video_urls.length + editForm.onedrive_cloud_video_urls.length;

  return (
    <Dialog 
      open={open} 
      onClose={() => !saving && onClose()}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionProps={{ onEnter: handleEnter }}
      PaperProps={{
        sx: { 
          borderRadius: isMobile ? 0 : 3, 
          maxHeight: isMobile ? "100%" : "90vh" 
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          fontWeight: 600, 
          borderBottom: "1px solid #e5e7eb",
          fontSize: { xs: "1rem", sm: "1.25rem" },
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
        }}
      >
        Edit Kuppi
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={editTab} 
            onChange={(_, v) => setEditTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 40, sm: 48 },
              "& .MuiTab-root": {
                minHeight: { xs: 40, sm: 48 },
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                px: { xs: 1, sm: 2 },
                minWidth: { xs: "auto", sm: 90 },
              },
            }}
          >
            <Tab label="Info" sx={{ textTransform: "none" }} />
            <Tab 
              label={isMobile ? `(${editForm.youtube_links.length})` : `YouTube (${editForm.youtube_links.length})`}
              sx={{ textTransform: "none" }} 
              icon={<YouTubeIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: "#dc2626" }} />}
              iconPosition="start"
            />
            <Tab 
              label={isMobile ? `(${editForm.telegram_links.length})` : `Telegram (${editForm.telegram_links.length})`}
              sx={{ textTransform: "none" }}
              icon={<TelegramIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: "#0088cc" }} />}
              iconPosition="start"
            />
            <Tab 
              label={isMobile ? `(${cloudLinksCount})` : `Cloud (${cloudLinksCount})`}
              sx={{ textTransform: "none" }}
              icon={<CloudIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: "#6366f1" }} />}
              iconPosition="start"
            />
            <Tab 
              label={isMobile ? `(${editForm.material_urls.length})` : `Files (${editForm.material_urls.length})`}
              sx={{ textTransform: "none" }}
              icon={<FolderIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: "#059669" }} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <div 
          className="p-3 sm:p-4 overflow-y-auto" 
          style={{ maxHeight: isMobile ? "calc(100vh - 180px)" : "50vh" }}
        >
          {/* Basic Info Tab */}
          {editTab === 0 && (
            <div className="space-y-3 sm:space-y-4">
              <TextField
                label="Title"
                fullWidth
                size={isMobile ? "small" : "medium"}
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                disabled={saving}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={isMobile ? 3 : 4}
                size={isMobile ? "small" : "medium"}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                disabled={saving}
              />
            </div>
          )}

          {/* YouTube Links Tab */}
          {editTab === 1 && (
            <LinkEditor
              category="youtube_links"
              links={editForm.youtube_links}
              disabled={saving}
              onAdd={() => handleAddLink("youtube_links")}
              onUpdate={(i, v) => handleUpdateLink("youtube_links", i, v)}
              onRemove={(i) => handleRemoveLink("youtube_links", i)}
            />
          )}

          {/* Telegram Links Tab */}
          {editTab === 2 && (
            <LinkEditor
              category="telegram_links"
              links={editForm.telegram_links}
              disabled={saving}
              onAdd={() => handleAddLink("telegram_links")}
              onUpdate={(i, v) => handleUpdateLink("telegram_links", i, v)}
              onRemove={(i) => handleRemoveLink("telegram_links", i)}
            />
          )}

          {/* Cloud Links Tab */}
          {editTab === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Google Drive</h4>
                <LinkEditor
                  category="gdrive_cloud_video_urls"
                  links={editForm.gdrive_cloud_video_urls}
                  disabled={saving}
                  onAdd={() => handleAddLink("gdrive_cloud_video_urls")}
                  onUpdate={(i, v) => handleUpdateLink("gdrive_cloud_video_urls", i, v)}
                  onRemove={(i) => handleRemoveLink("gdrive_cloud_video_urls", i)}
                />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">OneDrive</h4>
                <LinkEditor
                  category="onedrive_cloud_video_urls"
                  links={editForm.onedrive_cloud_video_urls}
                  disabled={saving}
                  onAdd={() => handleAddLink("onedrive_cloud_video_urls")}
                  onUpdate={(i, v) => handleUpdateLink("onedrive_cloud_video_urls", i, v)}
                  onRemove={(i) => handleRemoveLink("onedrive_cloud_video_urls", i)}
                />
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {editTab === 4 && (
            <LinkEditor
              category="material_urls"
              links={editForm.material_urls}
              disabled={saving}
              onAdd={() => handleAddLink("material_urls")}
              onUpdate={(i, v) => handleUpdateLink("material_urls", i, v)}
              onRemove={(i) => handleRemoveLink("material_urls", i)}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions 
        sx={{ 
          p: { xs: 1.5, sm: 2.5 }, 
          borderTop: "1px solid #e5e7eb",
          gap: 1,
        }}
      >
        <Button 
          onClick={onClose} 
          disabled={saving}
          size={isMobile ? "small" : "medium"}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size={isMobile ? "small" : "medium"}
          disabled={saving || !editForm.title.trim() || !editForm.description.trim()}
          sx={{
            background: "linear-gradient(to right, #8b5cf6, #6366f1)",
            textTransform: "none",
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            "&:hover": {
              background: "linear-gradient(to right, #7c3aed, #4f46e5)",
            },
          }}
        >
          {saving ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
