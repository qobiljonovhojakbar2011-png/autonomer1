import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const LuxuryIntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 950);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070709] pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#F5F5F7]">
              Premium <span className="gold-text-gradient">Auto Nomer</span>
            </span>
            <div className="w-44 h-[1.5px] bg-white/10 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F8E3A1]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
