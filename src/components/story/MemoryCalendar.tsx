import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

interface MemoryCalendarProps {
  specialDate: string;
}

export function MemoryCalendar({ specialDate }: MemoryCalendarProps) {
  const date = new Date(specialDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get first day of the month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create array of days
  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-rose-200"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <CalendarIcon className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Özel Günümüz
        </h3>
        <p className="text-gray-700 text-lg">{monthNames[month]} {year}</p>
      </div>
      
      <div className="max-w-sm mx-auto">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <div key={dayName} className="text-center text-sm font-medium text-gray-500 py-2">
              {dayName}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayNum, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.02 }}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg
                ${dayNum === null ? 'invisible' : ''}
                ${dayNum === day 
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg font-bold' 
                  : 'hover:bg-pink-50 text-gray-700'
                }
              `}
            >
              {dayNum && (
                <motion.span
                  whileHover={dayNum === day ? { scale: 1.1 } : { scale: 1.05 }}
                  className={dayNum === day ? 'relative' : ''}
                >
                  {dayNum}
                  {dayNum === day && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-pink-300 rounded-lg -z-10"
                    />
                  )}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}