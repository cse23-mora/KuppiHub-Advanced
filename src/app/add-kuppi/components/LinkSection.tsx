"use client";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloudIcon from "@mui/icons-material/Cloud";
import FolderIcon from "@mui/icons-material/Folder";
import { validateLinkUrl } from "@/lib/validation";
import { LinkItem } from "./types";

interface LinkSectionProps {
  type: "youtube" | "telegram" | "gdrive" | "onedrive" | "material";
  links: LinkItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, url: string) => void;
}

const config = {
  youtube: {
    title: "YouTube Links",
    icon: YouTubeIcon,
    color: "#dc2626",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    placeholder: "https://www.youtube.com/watch?v=...",
  },
  telegram: {
    title: "Telegram Links",
    icon: TelegramIcon,
    color: "#0088cc",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    placeholder: "https://t.me/...",
  },
  gdrive: {
    title: "Google Drive Links",
    icon: CloudIcon,
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    placeholder: "https://drive.google.com/...",
  },
  onedrive: {
    title: "OneDrive Links",
    icon: CloudIcon,
    color: "#0078d4",
    bgColor: "#f0f9ff",
    borderColor: "#bae6fd",
    placeholder: "https://onedrive.live.com/...",
  },
  material: {
    title: "Material Links (PDF, Docs)",
    icon: FolderIcon,
    color: "#6b7280",
    bgColor: "#f9fafb",
    borderColor: "#e5e7eb",
    placeholder: "Direct link to PDF or document",
  },
};

export default function LinkSection({
  type,
  links,
  onAdd,
  onRemove,
  onUpdate,
}: LinkSectionProps) {
  const { title, icon: Icon, color, bgColor, borderColor, placeholder } = config[type];

  const handleUrlChange = (id: string, value: string) => {
    const validation = validateLinkUrl(value);
    if (validation.valid) {
      onUpdate(id, value);
    }
    // If invalid, we don't update the value, silently reject the invalid characters
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Icon sx={{ color, fontSize: { xs: 18, sm: 22 } }} />
          <span className="font-medium text-gray-800 text-sm sm:text-base">{title}</span>
        </div>
        <Button
          size="small"
          startIcon={<AddIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
          onClick={onAdd}
          sx={{
            textTransform: "none",
            color,
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            minWidth: "auto",
            px: { xs: 1, sm: 1.5 },
            "&:hover": {
              backgroundColor: `${color}15`,
            },
          }}
        >
          Add
        </Button>
      </div>
      
      <div className="space-y-2">
        {links.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-500 italic py-2">
            No links added yet. Click &quot;Add&quot; to add one.
          </p>
        ) : (
          links.map((link, index) => (
            <div key={link.id} className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs text-gray-400 w-5 sm:w-6 flex-shrink-0">{index + 1}.</span>
              <TextField
                fullWidth
                size="small"
                value={link.url}
                onChange={(e) => handleUrlChange(link.id, e.target.value)}
                placeholder={placeholder}
                helperText="Links cannot contain double quotes or commas"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                  "& .MuiOutlinedInput-input": {
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 1.5, sm: 2 },
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={() => onRemove(link.id)}
                sx={{
                  color: "#ef4444",
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  "&:hover": { backgroundColor: "#fee2e2" },
                }}
              >
                <DeleteIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              </IconButton>
            </div>
          ))
        )}
      </div>
    </Paper>
  );
}
