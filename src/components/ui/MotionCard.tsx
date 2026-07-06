'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionCardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
  delay?: number;
  children: ReactNode;
}

export function MotionCard({ accent = false, delay = 0, className, children, ...props }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -4 }}
      className={cn(accent ? 'brutal-card-accent' : 'brutal-card', 'p-6', className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}