
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SmartSection } from '@/types/section';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useSmartSections = () => {
  const [sections, setSections] = useState<SmartSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSections = async () => {
    if (!user) {
      setSections([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching sections for user:', user.id);
      const { data, error } = await supabase
        .from('smart_sections')
        .select('*')
        .eq('user_id', user.id) // Explicitly filter by user_id
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sections:', error);
        throw error;
      }
      
      console.log('Fetched sections:', data);
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (sectionData: {
    name: string;
    content: string;
    conditions: Record<string, any>;
  }) => {
    if (!user) {
      toast.error('You must be logged in to create sections');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      console.log('Creating section for user:', user.id);
      const { data, error } = await supabase
        .from('smart_sections')
        .insert([{
          ...sectionData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating section:', error);
        throw error;
      }
      
      console.log('Created section:', data);
      setSections(prev => [data, ...prev]);
      toast.success('Section created successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Error creating section:', error);
      toast.error('Failed to create section');
      return { success: false, error };
    }
  };

  const updateSection = async (id: string, updates: Partial<SmartSection>) => {
    if (!user) {
      toast.error('You must be logged in to update sections');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      console.log('Updating section:', id, 'for user:', user.id);
      const { data, error } = await supabase
        .from('smart_sections')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own sections
        .select()
        .single();

      if (error) {
        console.error('Error updating section:', error);
        throw error;
      }
      
      console.log('Updated section:', data);
      setSections(prev => prev.map(section => 
        section.id === id ? data : section
      ));
      toast.success('Section updated successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
      return { success: false, error };
    }
  };

  const deleteSection = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete sections');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      console.log('Deleting section:', id, 'for user:', user.id);
      const { error } = await supabase
        .from('smart_sections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own sections

      if (error) {
        console.error('Error deleting section:', error);
        throw error;
      }
      
      console.log('Deleted section:', id);
      setSections(prev => prev.filter(section => section.id !== id));
      toast.success('Section deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSections();
  }, [user]);

  return {
    sections,
    loading,
    createSection,
    updateSection,
    deleteSection,
    refetch: fetchSections
  };
};
