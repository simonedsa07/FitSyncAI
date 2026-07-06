'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export function CountUp({ value, duration = 1 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] });
    prev.current = value;
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}