// components/PageHeader.tsx
'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-10"
    >
      <h1 className="text-4xl font-bold mb-2">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {title}
        </span>
      </h1>
      <p className="text-lg font-medium text-gray-700">
        {subtitle}
      </p>
    </motion.div>
  );
}