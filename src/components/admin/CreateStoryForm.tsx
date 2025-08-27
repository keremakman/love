import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Upload, Calendar, Puzzle, Music, Image, FileText } from 'lucide-react';
import { useStories } from '../../hooks/useStories';

interface CreateStoryFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateStoryForm({ onBack, onSuccess }: CreateStoryFormProps) {
  const { createStory, uploadFile } = useStories();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    couple_names: '',
    page_title: '',
    url_slug: '',
    digital_letter: '',
    special_date: '',
    puzzle_message: ''
  });
  
  const [files, setFiles] = useState({
    cover_photo: null as File | null,
    gallery_photos: [] as File[],
    music_file: null as File | null,
    puzzle_photo: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from couple names
    if (name === 'couple_names') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, url_slug: slug }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'gallery_photos') {
        setFiles(prev => ({ ...prev, gallery_photos: [...prev.gallery_photos, file] }));
      } else {
        setFiles(prev => ({ ...prev, [type]: file }));
      }
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setFiles(prev => ({
      ...prev,
      gallery_photos: prev.gallery_photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload cover photo
      let cover_photo_url = '';
      if (files.cover_photo) {
        const { url, error } = await uploadFile(
          files.cover_photo,
          'story-assets',
          `covers/${Date.now()}-${files.cover_photo.name}`
        );
        if (error) throw error;
        cover_photo_url = url || '';
      }

      // Upload gallery photos
      const gallery_photos: string[] = [];
      for (const file of files.gallery_photos) {
        const { url, error } = await uploadFile(
          file,
          'story-assets',
          `gallery/${Date.now()}-${file.name}`
        );
        if (error) throw error;
        if (url) gallery_photos.push(url);
      }

      // Upload music
      let music_url = '';
      if (files.music_file) {
        const { url, error } = await uploadFile(
          files.music_file,
          'story-assets',
          `music/${Date.now()}-${files.music_file.name}`
        );
        if (error) throw error;
        music_url = url || '';
      }

      // Upload puzzle photo
      let puzzle_photo_url = '';
      if (files.puzzle_photo) {
        const { url, error } = await uploadFile(
          files.puzzle_photo,
          'story-assets',
          `puzzles/${Date.now()}-${files.puzzle_photo.name}`
        );
        if (error) throw error;
        puzzle_photo_url = url || '';
      }

      // Create story
      const { error } = await createStory({
        ...formData,
        cover_photo_url,
        gallery_photos,
        music_url,
        puzzle_photo_url
      });

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <Heart className="w-6 h-6 text-pink-500 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Create New Love Story</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couple's Names *
                </label>
                <input
                  type="text"
                  name="couple_names"
                  value={formData.couple_names}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="e.g., Zeynep & Ahmet"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  name="page_title"
                  value={formData.page_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="e.g., Our Fairytale"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /story/
                </span>
                <input
                  type="text"
                  name="url_slug"
                  value={formData.url_slug}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="e.g., zeynep-and-ahmet"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Media Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-pink-500" />
              Media & Assets
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500">
                        <span>Upload cover photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'cover_photo')}
                        />
                      </label>
                    </div>
                    {files.cover_photo && (
                      <p className="text-xs text-green-600">{files.cover_photo.name}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Music
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Music className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500">
                        <span>Upload music</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="audio/*"
                          onChange={(e) => handleFileChange(e, 'music_file')}
                        />
                      </label>
                    </div>
                    {files.music_file && (
                      <p className="text-xs text-green-600">{files.music_file.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Photos
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500">
                      <span>Add gallery photos</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'gallery_photos')}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {files.gallery_photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {files.gallery_photos.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-600 truncate px-2">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Content & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-pink-500" />
              Content & Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="special_date"
                    value={formData.special_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Love Letter *
                </label>
                <textarea
                  name="digital_letter"
                  value={formData.digital_letter}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Write a heartfelt message for the couple..."
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Puzzle Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Puzzle className="w-5 h-5 mr-2 text-pink-500" />
              Interactive Puzzle
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puzzle Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Puzzle className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500">
                        <span>Upload puzzle image</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'puzzle_photo')}
                        />
                      </label>
                    </div>
                    {files.puzzle_photo && (
                      <p className="text-xs text-green-600">{files.puzzle_photo.name}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puzzle Completion Message
                </label>
                <textarea
                  name="puzzle_message"
                  value={formData.puzzle_message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Message to show when puzzle is completed..."
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium text-lg disabled:opacity-50 flex items-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              {isLoading ? 'Creating Story...' : 'Create Love Story'}
            </motion.button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}