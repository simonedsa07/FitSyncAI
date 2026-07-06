'use client';

import { motion } from 'framer-motion';

export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute h-96 w-96 rounded-full"
        style={{ background: 'var(--accent)', filter: 'blur(90px)', opacity: 0.18, top: '-10%', left: '-10%' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-[420px] w-[420px] rounded-full"
        style={{ background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.14, top: '40%', right: '-15%' }}
        animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-80 w-80 rounded-full"
        style={{ background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.12, bottom: '-10%', left: '25%' }}
        animate={{ x: [0, 25, -25, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}