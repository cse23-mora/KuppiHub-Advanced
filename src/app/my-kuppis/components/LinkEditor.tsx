"use client";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloudIcon from "@mui/icons-material/Cloud";
import FolderIcon from "@mui/icons-material/Folder";
import { LinkCategory } from "./types";

interface LinkEditorProps {
  category: LinkCategory;
  links: string[];
  disabled: boolean;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const categoryConfig = {
  youtube_links: {
    icon: YouTubeIcon,
    color: "#dc2626",
    placeholder: "https://youtube.com/watch?v=...",
    label: "YouTube video links",
    emptyText: "No YouTube links",
  },
  telegram_links: {
    icon: TelegramIcon,
    color: "#0088cc",
    placeholder: "https://t.me/...",
    label: "Telegram video links",
    emptyText: "No Telegram links",
  },
  gdrive_cloud_video_urls: {
    icon: CloudIcon,
    color: "#4285f4",
    placeholder: "https://drive.google.com/...",
    label: "Google Drive links",
    emptyText: "No Google Drive links",
  },
  onedrive_cloud_video_urls: {
    icon: CloudIcon,
    color: "#0078d4",
    placeholder: "https://onedrive.live.com/...",
    label: "OneDrive links",
    emptyText: "No OneDrive links",
  },
  material_urls: {
    icon: FolderIcon,
    color: "#059669",
    placeholder: "https://...",
    label: "Material/document links",
    emptyText: "No material links",
  },
};

export default function LinkEditor({
  category,
  links,
  disabled,
  onAdd,
  onUpdate,
  onRemove,
}: LinkEditorProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600">{config.label}</p>
        <Button
          size="small"
          startIcon={<AddIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
          onClick={onAdd}
          disabled={disabled}
          sx={{ 
            textTransform: "none",
            fontSize: { xs: "0.7rem", sm: "0.875rem" },
            minWidth: { xs: "auto", sm: 64 },
            px: { xs: 1, sm: 2 },
          }}
        >
          Add
        </Button>
      </div>
      
      {links.length === 0 ? (
        <p className="text-center text-gray-400 py-4 sm:py-6 text-xs sm:text-sm">
          {config.emptyText}. Click &quot;Add&quot; to add one.
        </p>
      ) : (
        links.map((link, index) => (
          <div key={index} className="flex items-center gap-1.5 sm:gap-2">
            <Icon sx={{ color: config.color, flexShrink: 0, fontSize: { xs: 18, sm: 24 } }} />
            <TextField
              fullWidth
              size="small"
              placeholder={config.placeholder}
              value={link}
              onChange={(e) => onUpdate(index, e.target.value)}
              disabled={disabled}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: { xs: 0.75, sm: 1 },
                },
              }}
            />
            <IconButton 
              onClick={() => onRemove(index)}
              disabled={disabled}
              size="small"
              sx={{ 
                color: "#dc2626",
                width: { xs: 28, sm: 36 },
                height: { xs: 28, sm: 36 },
              }}
            >
              <DeleteIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </IconButton>
          </div>
        ))
      )}
    </div>
  );
}
