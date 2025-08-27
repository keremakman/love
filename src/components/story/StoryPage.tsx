import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import { Mail, Heart } from 'lucide-react';
import { useStories } from '../../hooks/useStories';
import { Story } from '../../types/Story';
import { MusicPlayer } from './MusicPlayer';
import { LoveCounter } from './LoveCounter';
import { PhotoGallery } from './PhotoGallery';
import { LetterModal } from './LetterModal';
import { MemoryCalendar } from './MemoryCalendar';
import { JigsawPuzzle } from './JigsawPuzzle';
import { HeartbeatButton } from './HeartbeatButton';

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
          setError('Story not found');
        } else {
          setStory(data);
        }
      } catch (err) {
        setError('Failed to load story');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [slug, getStoryBySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your love story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
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
        {/* Background Image */}
        {story.cover_photo_url && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={story.cover_photo_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          </motion.div>
        )}

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-center text-white px-4"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-4xl md:text-6xl font-bold mb-4 font-serif"
          >
            {story.couple_names}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-xl md:text-2xl mb-8 font-light"
          >
            {story.page_title}
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLetterOpen(true)}
            className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 rounded-full hover:bg-white/30 transition-all duration-200 font-medium flex items-center mx-auto"
          >
            <Mail className="w-5 h-5 mr-2" />
            Read Our Letter
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
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Content Sections */}
      <div className="relative z-10 -mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Love Counter */}
          <LoveCounter specialDate={story.special_date} />
          
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
              completionMessage={story.puzzle_message || "You completed our memory puzzle!"}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-20 text-center py-12 bg-gradient-to-t from-pink-100 to-transparent"
      >
        <div className="flex items-center justify-center space-x-2 text-pink-600">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-sm">Made with love</span>
          <Heart className="w-4 h-4 fill-current" />
        </div>
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