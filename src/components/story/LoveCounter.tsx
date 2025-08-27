import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface LoveCounterProps {
  specialDate: string;
}

export function LoveCounter({ specialDate }: LoveCounterProps) {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(specialDate).getTime();
      const now = new Date().getTime();
      const difference = now - start;

      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeElapsed({ years, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [specialDate]);

  const timeUnits = [
    { label: 'Years', value: timeElapsed.years, color: 'from-pink-500 to-rose-500' },
    { label: 'Days', value: timeElapsed.days, color: 'from-purple-500 to-indigo-500' },
    { label: 'Hours', value: timeElapsed.hours, color: 'from-blue-500 to-cyan-500' },
    { label: 'Minutes', value: timeElapsed.minutes, color: 'from-green-500 to-emerald-500' },
    { label: 'Seconds', value: timeElapsed.seconds, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-200"
    >
      <div className="text-center mb-6">
        <Clock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Love Story</h3>
        <p className="text-gray-600">Time together</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className={`bg-gradient-to-br ${unit.color} rounded-xl p-4 text-white text-center`}
          >
            <motion.div
              key={unit.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl md:text-3xl font-bold mb-1"
            >
              {unit.value}
            </motion.div>
            <div className="text-xs md:text-sm opacity-90">{unit.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}