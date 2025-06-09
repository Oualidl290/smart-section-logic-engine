
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SmartSection } from '@/types/section';
import { toast } from 'sonner';

export const useSmartSections = () => {
  const [sections, setSections] = useState<SmartSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('smart_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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
    try {
      const { data, error } = await supabase
        .from('smart_sections')
        .insert([sectionData])
        .select()
        .single();

      if (error) throw error;
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
    try {
      const { data, error } = await supabase
        .from('smart_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
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
    try {
      const { error } = await supabase
        .from('smart_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
  }, []);

  return {
    sections,
    loading,
    createSection,
    updateSection,
    deleteSection,
    refetch: fetchSections
  };
};
