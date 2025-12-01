"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@mui/material/Button";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Add New Kuppi
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Share your knowledge with fellow students</p>
        </div>
        <Link href="/my-kuppis">
          <Button
            variant="outlined"
            startIcon={<InventoryIcon />}
            sx={{
              borderColor: "#c7d2fe",
              color: "#4f46e5",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              "&:hover": {
                borderColor: "#a5b4fc",
                backgroundColor: "#eef2ff",
              },
            }}
          >
            My Kuppis
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
