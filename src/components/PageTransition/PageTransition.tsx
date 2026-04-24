import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import './PageTransition.css';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      className="page-transition-wrapper"
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // easeOut cubic
      }}
    >
      {children}
    </motion.div>
  );
}
