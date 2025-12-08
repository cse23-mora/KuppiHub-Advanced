"use client";

import { motion } from "framer-motion";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function NewTutorCard() {
  return (
    <>
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
            mb: { xs: 4, sm: 5 },
            mt: { xs: 3, sm: 4 },
            mx: { xs: 1, sm: 2 },
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
