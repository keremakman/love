import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Volume2 } from 'lucide-react';

export function HeartbeatRhythm() {
  const [isBeating, setIsBeating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleHeartClick = () => {
    setIsBeating(true);
    
    // Create heartbeat sound effect
    if (!audioRef.current) {
      // Create a more realistic heartbeat sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const createHeartbeatSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        // Second beat
        setTimeout(() => {
          const oscillator2 = audioContext.createOscillator();
          const gainNode2 = audioContext.createGain();
          
          oscillator2.connect(gainNode2);
          gainNode2.connect(audioContext.destination);
          
          oscillator2.frequency.setValueAtTime(60, audioContext.currentTime);
          oscillator2.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.1);
          
          gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          
          oscillator2.start(audioContext.currentTime);
          oscillator2.stop(audioContext.currentTime + 0.15);
        }, 200);
      };
      
      createHeartbeatSound();
    }
    
    setTimeout(() => setIsBeating(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl p-10 shadow-2xl border border-rose-200"
    >
      <div className="text-center mb-8">
        <Volume2 className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Aşkımızın Ritmi
        </h3>
        <p className="text-gray-700 text-lg">
          Kalbim senin için böyle atıyor... Dokun ve hisset.
        </p>
      </div>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleHeartClick}
          className="relative group"
        >
          <motion.div
            animate={isBeating ? {
              scale: [1, 1.4, 1, 1.3, 1],
            } : {
              scale: [1, 1.05, 1],
            }}
            transition={isBeating ? 
              { duration: 1.2, ease: "easeInOut" } : 
              { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
            className="w-32 h-32 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-rose-300/50 transition-all duration-300"
          >
            <Heart className="w-16 h-16 text-white fill-current" />
          </motion.div>
          
          {/* Pulse rings */}
          <motion.div
            animate={isBeating ? {
              scale: [1, 2.5],
              opacity: [0.6, 0]
            } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-4 border-rose-400"
          />
          
          <motion.div
            animate={isBeating ? {
              scale: [1, 2],
              opacity: [0.4, 0]
            } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-0 rounded-full border-4 border-pink-400"
          />
          
          {/* Floating hearts */}
          {isBeating && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 200,
                    y: -100 - Math.random() * 50,
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-current" />
                </motion.div>
              ))}
            </>
          )}
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-gray-600 text-sm">
          💕 Kalbe dokun ve aşkın ritmini hisset 💕
        </p>
      </motion.div>
    </motion.div>
  );
}