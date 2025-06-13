
import { useState } from 'react';
import { useSmartSections } from './useSmartSections';
import { SmartSection } from '@/types/section';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useSectionActions = () => {
  const { updateSection, deleteSection, createSection } = useSmartSections();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { user } = useAuth();

  const toggleSection = async (sectionId: string, currentStatus: boolean) => {
    if (!user) {
      toast.error('You must be logged in to toggle sections');
      return;
    }

    try {
      await updateSection(sectionId, { is_enabled: !currentStatus });
      toast.success(`Section ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to toggle section status');
    }
  };

  const duplicateSection = async (section: SmartSection) => {
    if (!user) {
      toast.error('You must be logged in to duplicate sections');
      return;
    }

    try {
      const duplicatedSection = {
        name: `${section.name} (Copy)`,
        content: section.content,
        conditions: (section.conditions && typeof section.conditions === 'object' && !Array.isArray(section.conditions)) 
          ? section.conditions as Record<string, any>
          : {}
      };
      
      await createSection(duplicatedSection);
      toast.success('Section duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate section');
    }
  };

  const confirmDelete = async (sectionId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete sections');
      return;
    }

    setIsDeleting(sectionId);
    try {
      await deleteSection(sectionId);
      toast.success('Section deleted successfully');
    } catch (error) {
      toast.error('Failed to delete section');
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    toggleSection,
    duplicateSection,
    confirmDelete,
    isDeleting
  };
};
