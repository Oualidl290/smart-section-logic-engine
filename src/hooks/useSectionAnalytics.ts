
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SectionUsage } from '@/types/section';

export const useSectionAnalytics = (sectionId?: string) => {
  const [analytics, setAnalytics] = useState({
    views: 0,
    uniqueViews: 0,
    recentActivity: [] as SectionUsage[]
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      let query = supabase.from('section_usage').select('*');
      
      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }

      const { data, error } = await query.order('viewed_at', { ascending: false });

      if (error) throw error;

      const views = data?.length || 0;
      const uniqueViews = new Set(data?.map(item => String(item.ip_address || 'unknown'))).size;

      setAnalytics({
        views,
        uniqueViews,
        recentActivity: data?.slice(0, 10) || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (sectionId: string, pageUrl: string) => {
    try {
      await supabase.from('section_usage').insert([{
        section_id: sectionId,
        page_url: pageUrl,
        user_agent: navigator.userAgent
      }]);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [sectionId]);

  return {
    analytics,
    loading,
    trackView,
    refetch: fetchAnalytics
  };
};
