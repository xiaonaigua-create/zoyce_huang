import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  distance?: number;
  delay?: number;
  duration?: number;
}

export default function SlideIn({ 
  children, 
  direction = 'left', 
  distance = 100, 
  delay = 0,
  duration = 1.2 
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 动画在组件挂载时自动触发
  }, []);

  const x = direction === 'left' ? -distance : distance;

  return (
    <motion.div
      ref={ref}
      initial={{ x, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        type: "tween", 
        ease: "easeOut",
        delay,
        duration 
      }}
    >
      {children}
    </motion.div>
  );
}
