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

      {/* Tutor Profile Form Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            mb: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PersonAddIcon sx={{ color: "white", fontSize: { xs: 24, sm: 28 } }} />
            <Box>
              <p className="text-white font-semibold text-sm sm:text-base">
                Want to be featured as a Tutor?
              </p>
              <p className="text-white/80 text-xs sm:text-sm">
                Fill out the form to add your profile to our Tutors section
              </p>
            </Box>
          </Box>
          <Button
            variant="contained"
            href="https://forms.gle/zasMHhtQgLnuVjgs7"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              bgcolor: "white",
              color: "#667eea",
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Fill Tutor Form
          </Button>
        </Box>
      </motion.div>
    </>
  );
}
