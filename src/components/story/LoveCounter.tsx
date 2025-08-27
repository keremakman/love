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
    { label: 'Yıl', value: timeElapsed.years, color: 'from-rose-500 to-pink-500' },
    { label: 'Gün', value: timeElapsed.days, color: 'from-purple-500 to-indigo-500' },
    { label: 'Saat', value: timeElapsed.hours, color: 'from-blue-500 to-cyan-500' },
    { label: 'Dakika', value: timeElapsed.minutes, color: 'from-green-500 to-emerald-500' },
    { label: 'Saniye', value: timeElapsed.seconds, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-rose-200"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Aşk Hikayemiz
        </h3>
        <p className="text-gray-700 text-lg">Birlikte geçirdiğimiz zaman</p>
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
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-2xl md:text-4xl font-bold mb-2"
            >
              {unit.value}
            </motion.div>
            <div className="text-sm md:text-base opacity-90 font-medium">{unit.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}