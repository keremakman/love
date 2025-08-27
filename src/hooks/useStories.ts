import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Story, CreateStoryData } from '../types/Story';

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createStory = async (storyData: CreateStoryData) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single();

      if (error) throw error;
      
      await fetchStories();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating story:', error);
      return { data: null, error };
    }
  };

  const getStoryBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('url_slug', slug)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching story:', error);
      return { data: null, error };
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { url: null, error };
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    isLoading,
    createStory,
    getStoryBySlug,
    uploadFile,
    fetchStories,
  };
}