import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: string;
}

export function LetterModal({ isOpen, onClose, letter }: LetterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-pink-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-pink-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-800">A Letter of Love</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
              <Heart className="w-6 h-6 text-rose-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-800">Aşk Mektubu</h3>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none"
            >
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg"
                dangerouslySetInnerHTML={{ __html: letter.replace(/\n/g, '<br>') }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center space-x-2 text-rose-500">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Tüm sevgimizle</span>
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}