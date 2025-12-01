"use client";

import { motion } from "framer-motion";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloudIcon from "@mui/icons-material/Cloud";
import { Kuppi } from "./types";

interface KuppiCardProps {
  kuppi: Kuppi;
  index: number;
  togglingId: number | null;
  onToggleVisibility: (id: number) => void;
  onEdit: (kuppi: Kuppi) => void;
}

export default function KuppiCard({ 
  kuppi, 
  index, 
  togglingId, 
  onToggleVisibility, 
  onEdit 
}: KuppiCardProps) {
  // Count total links
  const countLinks = () => {
    let count = 0;
    if (kuppi.youtube_links?.length) count += kuppi.youtube_links.length;
    if (kuppi.telegram_links?.length) count += kuppi.telegram_links.length;
    if (kuppi.gdrive_cloud_video_urls?.length) count += kuppi.gdrive_cloud_video_urls.length;
    if (kuppi.onedrive_cloud_video_urls?.length) count += kuppi.onedrive_cloud_video_urls.length;
    if (kuppi.material_urls?.length) count += kuppi.material_urls.length;
    return count;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        sx={{
          borderRadius: { xs: 2, sm: 3 },
          opacity: kuppi.is_hidden ? 0.6 : 1,
          border: kuppi.is_hidden ? "2px dashed #d1d5db" : "1px solid #e5e7eb",
          transition: "all 0.2s",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Top row: Chips and Actions */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Chip
                  label={kuppi.module?.code || "Unknown"}
                  size="small"
                  sx={{
                    backgroundColor: "#e0e7ff",
                    color: "#4f46e5",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
                {kuppi.is_hidden && (
                  <Chip
                    icon={<VisibilityOffIcon sx={{ fontSize: 12 }} />}
                    label="Hidden"
                    size="small"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      fontSize: "0.65rem",
                      height: 22,
                      "& .MuiChip-icon": { ml: 0.5 },
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <IconButton
                  onClick={() => onToggleVisibility(kuppi.id)}
                  disabled={togglingId === kuppi.id}
                  size="small"
                  sx={{
                    backgroundColor: kuppi.is_hidden ? "#fef3c7" : "#f3f4f6",
                    width: 32,
                    height: 32,
                  }}
                >
                  {togglingId === kuppi.id ? (
                    <CircularProgress size={16} />
                  ) : kuppi.is_hidden ? (
                    <VisibilityIcon sx={{ fontSize: 16, color: "#92400e" }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => onEdit(kuppi)}
                  size="small"
                  sx={{
                    backgroundColor: "#e0e7ff",
                    width: 32,
                    height: 32,
                  }}
                >
                  <EditIcon sx={{ fontSize: 16, color: "#4f46e5" }} />
                </IconButton>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
              {kuppi.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-xs line-clamp-2 mb-2">
              {kuppi.description}
            </p>

            {/* Links info */}
            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
              {kuppi.youtube_links?.length > 0 && (
                <span className="flex items-center gap-0.5">
                  <YouTubeIcon sx={{ fontSize: 14, color: "#dc2626" }} />
                  {kuppi.youtube_links.length}
                </span>
              )}
              {kuppi.telegram_links && kuppi.telegram_links.length > 0 && (
                <span className="flex items-center gap-0.5">
                  <TelegramIcon sx={{ fontSize: 14, color: "#0088cc" }} />
                  {kuppi.telegram_links.length}
                </span>
              )}
              {(kuppi.gdrive_cloud_video_urls?.length || kuppi.onedrive_cloud_video_urls?.length) && (
                <span className="flex items-center gap-0.5">
                  <CloudIcon sx={{ fontSize: 14, color: "#6366f1" }} />
                  {(kuppi.gdrive_cloud_video_urls?.length || 0) + (kuppi.onedrive_cloud_video_urls?.length || 0)}
                </span>
              )}
              <span className="text-gray-300">•</span>
              <span>{countLinks()} links</span>
              <span className="text-gray-300">•</span>
              <span>{new Date(kuppi.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Module info */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Chip
                  label={kuppi.module?.code || "Unknown"}
                  size="small"
                  sx={{
                    backgroundColor: "#e0e7ff",
                    color: "#4f46e5",
                    fontWeight: 600,
                  }}
                />
                {kuppi.is_hidden && (
                  <Chip
                    icon={<VisibilityOffIcon sx={{ fontSize: 16 }} />}
                    label="Hidden"
                    size="small"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                    }}
                  />
                )}
                {kuppi.is_kuppi && (
                  <Chip
                    label="Kuppi"
                    size="small"
                    sx={{
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                    }}
                  />
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                {kuppi.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {kuppi.description}
              </p>

              {/* Links info */}
              <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                {kuppi.youtube_links?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <YouTubeIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                    {kuppi.youtube_links.length}
                  </span>
                )}
                {kuppi.telegram_links && kuppi.telegram_links.length > 0 && (
                  <span className="flex items-center gap-1">
                    <TelegramIcon sx={{ fontSize: 18, color: "#0088cc" }} />
                    {kuppi.telegram_links.length}
                  </span>
                )}
                {(kuppi.gdrive_cloud_video_urls?.length || kuppi.onedrive_cloud_video_urls?.length) && (
                  <span className="flex items-center gap-1">
                    <CloudIcon sx={{ fontSize: 18, color: "#6366f1" }} />
                    {(kuppi.gdrive_cloud_video_urls?.length || 0) + (kuppi.onedrive_cloud_video_urls?.length || 0)}
                  </span>
                )}
                <span className="text-gray-400">•</span>
                <span>{countLinks()} total links</span>
                <span className="text-gray-400">•</span>
                <span>{new Date(kuppi.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <IconButton
                onClick={() => onToggleVisibility(kuppi.id)}
                disabled={togglingId === kuppi.id}
                sx={{
                  backgroundColor: kuppi.is_hidden ? "#fef3c7" : "#f3f4f6",
                  "&:hover": {
                    backgroundColor: kuppi.is_hidden ? "#fde68a" : "#e5e7eb",
                  },
                }}
              >
                {togglingId === kuppi.id ? (
                  <CircularProgress size={20} />
                ) : kuppi.is_hidden ? (
                  <VisibilityIcon sx={{ color: "#92400e" }} />
                ) : (
                  <VisibilityOffIcon sx={{ color: "#6b7280" }} />
                )}
              </IconButton>
              <IconButton
                onClick={() => onEdit(kuppi)}
                sx={{
                  backgroundColor: "#e0e7ff",
                  "&:hover": { backgroundColor: "#c7d2fe" },
                }}
              >
                <EditIcon sx={{ color: "#4f46e5" }} />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
