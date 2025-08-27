import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Heart, Puzzle, Target, Zap } from 'lucide-react';

export function GamesSection() {
  const games = [
    {
      id: 'flappy-love',
      title: 'Flappy Aşk',
      description: 'Aşk dolu bir maceraya çık! Kalpleri topla ve engelleri aş.',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'from-rose-100 to-pink-100'
    },
    {
      id: 'catch-hearts',
      title: 'Kalpleri Yakala',
      description: 'Gökyüzünden düşen kalpleri yakala ve puanını artır!',
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-100 to-indigo-100'
    },
    {
      id: 'love-puzzle',
      title: 'Aşk Yapbozu',
      description: 'Romantik resimleri tamamla ve aşk hikayelerini keşfet.',
      icon: Puzzle,
      color: 'from-pink-500 to-purple-500',
      bgColor: 'from-pink-100 to-purple-100'
    },
    {
      id: 'love-memory',
      title: 'Aşk Hafızası',
      description: 'Eşleşen kalp çiftlerini bul ve hafızanı test et!',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-100 to-red-100'
    }
  ];

  const handleGameClick = (gameId: string) => {
    // Open game in new window/tab
    window.open(`/games/${gameId}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-10 shadow-2xl border border-indigo-200"
    >
      <div className="text-center mb-10">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Gamepad2 className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Aşk Oyunları
        </h3>
        <p className="text-gray-700 text-lg">
          Eğlenceli oyunlarla aşkınızı kutlayın
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game, index) => {
          const IconComponent = game.icon;
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameClick(game.id)}
              className={`bg-gradient-to-br ${game.bgColor} rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 border-white/50 hover:border-white/80 shadow-lg hover:shadow-xl`}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {game.title}
                </h4>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {game.description}
                </p>
                
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className={`h-1 bg-gradient-to-r ${game.color} rounded-full mt-4 mx-auto transition-all duration-300`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-center mt-8"
      >
        <p className="text-gray-600 text-sm">
          🎮 Oyunlar yeni sekmede açılacak 🎮
        </p>
      </motion.div>
    </motion.div>
  );
}