import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Upload, Sparkles, Users } from 'lucide-react';

export function LoveCompatibilityTest() {
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [compatibility, setCompatibility] = useState(100);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, photoNumber: 1 | 2) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (photoNumber === 1) {
          setPhoto1(result);
        } else {
          setPhoto2(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeCompatibility = () => {
    if (!photo1 || !photo2) return;
    
    setIsAnalyzing(true);
    setShowResult(false);
    
    // Simulate analysis with loading animation
    setTimeout(() => {
      setCompatibility(100); // Always 100%
      setIsAnalyzing(false);
      setShowResult(true);
    }, 3000);
  };

  const resetTest = () => {
    setPhoto1(null);
    setPhoto2(null);
    setShowResult(false);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-10 shadow-2xl border border-purple-200"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Aşk Uyumu Testi 💘
        </h3>
        <p className="text-gray-700 text-lg">
          Fotoğraflarınızı yükleyin ve aşk uyumunuzu keşfedin
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Photo 1 Upload */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">İlk Fotoğraf</h4>
            <div className="relative">
              {photo1 ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-purple-200"
                >
                  <img src={photo1} alt="Photo 1" className="w-full h-full object-cover" />
                </motion.div>
              ) : (
                <div className="w-48 h-48 mx-auto border-4 border-dashed border-purple-300 rounded-2xl flex items-center justify-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-purple-600 font-medium">Fotoğraf Yükle</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 1)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Photo 2 Upload */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">İkinci Fotoğraf</h4>
            <div className="relative">
              {photo2 ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-pink-200"
                >
                  <img src={photo2} alt="Photo 2" className="w-full h-full object-cover" />
                </motion.div>
              ) : (
                <div className="w-48 h-48 mx-auto border-4 border-dashed border-pink-300 rounded-2xl flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                    <p className="text-pink-600 font-medium">Fotoğraf Yükle</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 2)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Analysis Button */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzeCompatibility}
            disabled={!photo1 || !photo2 || isAnalyzing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isAnalyzing ? 'Analiz Ediliyor...' : 'Uyumu Analiz Et'}
          </motion.button>
        </div>

        {/* Loading Animation */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Heart className="w-full h-full text-purple-500 fill-current" />
              </motion.div>
              <p className="text-gray-600">Yapay zeka aşk uyumunuzu hesaplıyor...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border-2 border-rose-200 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="mb-6"
              >
                <Sparkles className="w-16 h-16 text-rose-500 mx-auto" />
              </motion.div>
              
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Sonuç</h4>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-6xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4"
              >
                %{compatibility}
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-700 font-semibold mb-6"
              >
                🎉 Siz birbiriniz için yaratıldınız! 🎉
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-600 mb-6"
              >
                Yapay zeka analizimiz gösteriyor ki, aranızda mükemmel bir uyum var. 
                Bu kadar yüksek uyum oranı çok nadir görülür!
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTest}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium"
              >
                Yeniden Test Et
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}