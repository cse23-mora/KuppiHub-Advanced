"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 sm:py-12 px-4 sm:px-6 bg-white rounded-2xl shadow-lg border border-blue-100"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <FolderIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: "#6366f1" }} />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No kuppis yet</h3>
      <p className="text-gray-600 text-sm mb-4 sm:mb-6">You haven&apos;t uploaded any kuppis yet.</p>
      <Link href="/add-kuppi">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(to right, #8b5cf6, #6366f1)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Add Your First Kuppi
        </Button>
      </Link>
    </motion.div>
  );
}
