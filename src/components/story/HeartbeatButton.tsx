import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function HeartbeatButton() {
  const [isBeating, setIsBeating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    setIsBeating(true);
    
    // Create and play heartbeat sound
    if (!audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGm+DyvmwhBTOR2O/Jdjw=');
    }
    
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Handle autoplay restrictions
    });
    
    setTimeout(() => setIsBeating(false), 1000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white z-50"
    >
      <motion.div
        animate={isBeating ? {
          scale: [1, 1.3, 1, 1.2, 1],
        } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Heart className="w-8 h-8 fill-current" />
      </motion.div>
    </motion.button>
  );
}