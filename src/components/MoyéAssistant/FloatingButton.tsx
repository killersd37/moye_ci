import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export function FloatingButton({ onClick, isOpen, className }: FloatingButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={isOpen ? 'Fermer La Lumière Moyé' : 'Ouvrir La Lumière Moyé'}
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        'bg-[#8B6914] text-[#FDF3DC] focus:ring-[#C8960C]',
        'hover:bg-[#A07820] active:scale-95',
        className
      )}
      style={{
        boxShadow:
          '0 0 0 2px rgba(253,243,220,0.2), 0 0 24px rgba(200,150,12,0.4), 0 4px 14px rgba(0,0,0,0.2)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span
        className="moye-glow absolute inset-0 rounded-full opacity-60 blur-md"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(253,243,220,0.35), transparent 60%)',
        }}
      />
      <span className="absolute inset-0 rounded-full animate-pulse opacity-30" style={{ boxShadow: '0 0 20px rgba(200,150,12,0.5)' }} />
      <Sparkles className="relative z-10 h-7 w-7" strokeWidth={2} />
    </motion.button>
  );
}
