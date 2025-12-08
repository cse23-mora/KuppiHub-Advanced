"use client";

import { motion } from "framer-motion";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function InfoCard() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Alert 
          icon={<InfoIcon fontSize="small" />}
          severity="info"
          sx={{ 
            borderRadius: 3, 
            mb: { xs: 2, sm: 2 },
            "& .MuiAlert-message": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        >
          <p className="font-medium mb-1 text-sm">How to upload your Kuppi:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-xs sm:text-sm opacity-90">
            <li>
              Upload your video/materials to{" "}
              <a 
                href="https://t.me/KuppihubBot" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold underline"
              >
                @KuppihubBot
              </a>{" "}
              on Telegram
            </li>
            <li>Or upload to YouTube, Google Drive, or OneDrive</li>
            <li>Copy the share links and paste them below</li>
          </ol>
        </Alert>
      </motion.div>

     
    </>
  );
}
