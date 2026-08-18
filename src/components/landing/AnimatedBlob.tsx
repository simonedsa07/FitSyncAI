'use client';

import { motion } from 'framer-motion';

export function AnimatedBlob({
  className,
  color,
  duration = 18,
}: {
  className?: string;
  color: string;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0.55,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.15, 0.95, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}