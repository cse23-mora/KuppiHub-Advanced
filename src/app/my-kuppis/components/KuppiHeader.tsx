"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

export default function KuppiHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/add-kuppi">
            <IconButton 
              size="small"
              sx={{ 
                backgroundColor: "white",
                boxShadow: 1,
                "&:hover": { backgroundColor: "#f3f4f6" }
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                My Kuppis
              </span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">Manage your uploaded content</p>
          </div>
        </div>
        <Link href="/add-kuppi">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            sx={{
              background: "linear-gradient(to right, #8b5cf6, #6366f1)",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              "&:hover": {
                background: "linear-gradient(to right, #7c3aed, #4f46e5)",
              },
            }}
          >
            <span className="hidden sm:inline">Add New Kuppi</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
