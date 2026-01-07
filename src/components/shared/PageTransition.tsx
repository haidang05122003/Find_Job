'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState, useMemo, memo } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Memoized hook for reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Optimized easing curve
const EASING = [0.22, 1, 0.36, 1] as const;

// Memoized variants
const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASING } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: EASING } },
};

/**
 * PageTransition Component
 * Optimized page transitions with reduced motion support
 */
export const PageTransition = memo(function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: EASING }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

/**
 * Optimized animation components with shared reduced motion hook
 */
interface AnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// Memoized FadeIn
export const FadeIn = memo(function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = ''
}: AnimationProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Memoized SlideUp
export const SlideUp = memo(function SlideUp({
  children,
  delay = 0,
  duration = 0.6,
  className = ''
}: AnimationProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Memoized ScaleIn
export const ScaleIn = memo(function ScaleIn({
  children,
  delay = 0,
  duration = 0.4,
  className = ''
}: AnimationProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Stagger Container
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

const createContainerVariants = (staggerDelay: number): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: staggerDelay } },
});

export const StaggerContainer = memo(function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = ''
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = useMemo(() => createContainerVariants(staggerDelay), [staggerDelay]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Stagger Item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASING } },
};

export const StaggerItem = memo(function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
});

export default PageTransition;
