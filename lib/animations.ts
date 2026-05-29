import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleUp: Variants = {
  initial: { scale: 0.92, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

export const slideInLeft: Variants = {
  initial: { x: -50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

export const slideInRight: Variants = {
  initial: { x: 50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

export const handleMagnetic = (e: React.MouseEvent<HTMLElement>, strength = 0.35) => {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  if (target) {
    target.style.transition = 'transform 0.1s ease-out';
    target.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }
};

export const resetMagnetic = (e: React.MouseEvent<HTMLElement>) => {
  const target = e.currentTarget;
  if (target) {
    target.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
    target.style.transform = 'translate(0px, 0px)';
  }
};
