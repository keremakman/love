import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import { Mail, Heart, Gamepad2 } from 'lucide-react';
import { useStories } from '../../hooks/useStories';
import { Story } from '../../types/Story';
import { MusicPlayer } from './MusicPlayer';
import { LoveCounter } from './LoveCounter';
import { PhotoGallery } from './PhotoGallery';
import { LetterModal } from './LetterModal';
import { MemoryCalendar } from './MemoryCalendar';
import { JigsawPuzzle } from './JigsawPuzzle';
import { HeartbeatButton } from './HeartbeatButton';
import { HeartbeatRhythm } from './HeartbeatRhythm';
import { LoveCompatibilityTest } from './LoveCompatibilityTest';
import { GamesSection } from './GamesSection';

export function StoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getStoryBySlug } = useStories();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await getStoryBySlug(slug);
        if (error) {
          setError('Hikaye bulunamadı');
        } else {
          setStory(data);
        }
      } catch (err) {
        setError('Hikaye yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [slug, getStoryBySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-4"
          >
            <Heart className="w-8 h-8 text-rose-500 mx-auto fill-current" />
          </motion.div>
          <p className="text-gray-700 text-lg font-medium">Aşk hikayeniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Music Player */}
      {story.music_url && <MusicPlayer musicUrl={story.music_url} />}
      
      {/* Heartbeat Button */}
      <HeartbeatButton />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        {story.cover_photo_url && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={story.cover_photo_url}
              alt="Kapak Fotoğrafı"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20" />
          </motion.div>
        )}

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                opacity: 0
              }}
              animate={{ 
                y: -100,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
              className="absolute"
            >
              <Heart className="w-4 h-4 text-white/30 fill-current" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <Heart className="w-16 h-16 mx-auto text-rose-300 fill-current mb-4" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-serif bg-gradient-to-r from-rose-200 to-purple-200 bg-clip-text text-transparent"
          >
            {story.couple_names}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-xl md:text-3xl mb-8 font-light text-rose-100"
          >
            {story.page_title}
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLetterOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-2 border-white/20 px-10 py-4 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 font-medium flex items-center mx-auto shadow-2xl backdrop-blur-sm"
          >
            <Mail className="w-6 h-6 mr-3" />
            Aşk Mektubumuz
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-4 bg-white/80 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Content Sections */}
      <div className="relative z-10 -mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Love Counter */}
          <LoveCounter specialDate={story.special_date} />
          
          {/* Heartbeat Rhythm Section */}
          <HeartbeatRhythm />
          
          {/* Love Compatibility Test */}
          <LoveCompatibilityTest />
          
          {/* Photo Gallery */}
          {story.gallery_photos && story.gallery_photos.length > 0 && (
            <PhotoGallery photos={story.gallery_photos} />
          )}
          
          {/* Memory Calendar */}
          <MemoryCalendar specialDate={story.special_date} />
          
          {/* Jigsaw Puzzle */}
          {story.puzzle_photo_url && (
            <JigsawPuzzle
              imageUrl={story.puzzle_photo_url}
              completionMessage={story.puzzle_message || "Anı yapbozumuzu tamamladınız!"}
            />
          )}
          
          {/* Games Section */}
          <GamesSection />
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-24 text-center py-16 bg-gradient-to-t from-rose-100 via-pink-50 to-transparent"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center space-x-3 text-rose-600 mb-4"
        >
          <Heart className="w-6 h-6 fill-current" />
          <span className="text-lg font-medium">Aşkla yapıldı</span>
          <Heart className="w-6 h-6 fill-current" />
        </motion.div>
        <p className="text-gray-600">© 2024 Dijital Aşk Hikayeleri</p>
      </motion.footer>

      {/* Letter Modal */}
      <LetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        letter={story.digital_letter}
      />
    </div>
  );
}