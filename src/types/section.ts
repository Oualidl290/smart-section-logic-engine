
import { Json } from '@/integrations/supabase/types';

export interface SmartSection {
  id: string;
  name: string;
  content: string;
  conditions: Json;
  is_enabled: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

// Add Section type alias for backward compatibility
export type Section = SmartSection;

export interface SectionUsage {
  id: string;
  section_id: string;
  user_id: string | null;
  ip_address: unknown;
  viewed_at: string;
  page_url: string;
  user_agent: string;
}

export interface UserSettings {
  id: string;
  license_key: string;
  show_by_default: boolean;
  debug_mode: 'on' | 'off';
  performance_mode: 'fast' | 'balanced' | 'quality';
  section_loading: 'lazy' | 'eager';
  cache_duration: number;
  custom_css: string;
  rtl_support: boolean;
  created_at: string;
  updated_at: string;
}
