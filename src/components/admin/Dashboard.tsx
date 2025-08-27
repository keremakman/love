import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Calendar, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useStories } from '../../hooks/useStories';
import { format } from 'date-fns';

interface DashboardProps {
  onCreateNew: () => void;
}

export function Dashboard({ onCreateNew }: DashboardProps) {
  const { signOut } = useAuth();
  const { stories, isLoading } = useStories();

  const handleSignOut = () => {
    signOut();
  };

  const handleViewStory = (slug: string) => {
    window.open(`/story/${slug}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Love Stories Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateNew}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Story
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Love Stories</h2>
          <p className="text-gray-600">Manage and view all created love stories</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No stories created yet</h3>
            <p className="text-gray-500 mb-6">Create your first love story to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateNew}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Story
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:border-pink-300 transition-all duration-200 hover:shadow-xl"
              >
                <div className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg mb-4 overflow-hidden">
                  {story.cover_photo_url ? (
                    <img
                      src={story.cover_photo_url}
                      alt={story.couple_names}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-12 h-12 text-pink-400" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{story.couple_names}</h3>
                <p className="text-gray-600 text-sm mb-4">{story.page_title}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(story.created_at), 'MMM d, yyyy')}
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    /{story.url_slug}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewStory(story.url_slug)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Story
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}