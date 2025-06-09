
export interface SmartSection {
  id: string;
  name: string;
  content: string;
  conditions: Record<string, any>;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionUsage {
  id: string;
  section_id: string;
  ip_address: string;
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
