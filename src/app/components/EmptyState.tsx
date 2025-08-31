// components/EmptyState.tsx
'use client';

import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 px-6 bg-white rounded-2xl shadow-lg border border-blue-100"
    >
      <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Videos Available</h3>
      <p className="text-gray-600">There are no videos or kuppis available for this module yet.</p>
    </motion.div>
  );
}