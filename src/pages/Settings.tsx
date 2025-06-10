
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface UserSettings {
  id: string;
  debug_mode: string;
  show_by_default: boolean;
  performance_mode: string;
  rtl_support: boolean;
  cache_duration: number;
  license_key: string;
  custom_css: string;
  section_loading: string;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const defaultSettings: Partial<UserSettings> = {
          debug_mode: 'off',
          show_by_default: true,
          performance_mode: 'balanced',
          rtl_support: false,
          cache_duration: 24,
          license_key: '',
          custom_css: '',
          section_loading: 'eager',
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert([{ id: user.id, ...defaultSettings }])
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Failed to load settings",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Failed to save settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar selectedView="settings" onViewChange={() => {}} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="text-center">Loading settings...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar selectedView="settings" onViewChange={() => {}} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <SettingsIcon className="h-8 w-8" />
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure your Smart Sections preferences
                </p>
              </div>
              <Button onClick={handleSaveSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic configuration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show sections by default</Label>
                    <p className="text-sm text-muted-foreground">
                      Display sections when conditions are not met
                    </p>
                  </div>
                  <Switch
                    checked={settings?.show_by_default || false}
                    onCheckedChange={(checked) => updateSetting('show_by_default', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>RTL Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable right-to-left text support
                    </p>
                  </div>
                  <Switch
                    checked={settings?.rtl_support || false}
                    onCheckedChange={(checked) => updateSetting('rtl_support', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cache Duration (hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={settings?.cache_duration || 24}
                    onChange={(e) => updateSetting('cache_duration', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long to cache section conditions (1-168 hours)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>
                  Optimize loading and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Performance Mode</Label>
                  <Select
                    value={settings?.performance_mode || 'balanced'}
                    onValueChange={(value) => updateSetting('performance_mode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select performance mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast (Less features)</SelectItem>
                      <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                      <SelectItem value="full">Full (All features)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section Loading</Label>
                  <Select
                    value={settings?.section_loading || 'eager'}
                    onValueChange={(value) => updateSetting('section_loading', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select loading strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eager">Eager (Load immediately)</SelectItem>
                      <SelectItem value="lazy">Lazy (Load when needed)</SelectItem>
                      <SelectItem value="viewport">Viewport (Load when visible)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Developer Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Developer Settings</CardTitle>
                <CardDescription>
                  Advanced options for debugging and customization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Debug Mode</Label>
                  <Select
                    value={settings?.debug_mode || 'off'}
                    onValueChange={(value) => updateSetting('debug_mode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select debug mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="console">Console Logging</SelectItem>
                      <SelectItem value="visual">Visual Indicators</SelectItem>
                      <SelectItem value="full">Full Debug Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>License Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your license key"
                    value={settings?.license_key || ''}
                    onChange={(e) => updateSetting('license_key', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Required for premium features
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Custom CSS</Label>
                  <Textarea
                    placeholder="/* Custom CSS for sections */"
                    value={settings?.custom_css || ''}
                    onChange={(e) => updateSetting('custom_css', e.target.value)}
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Custom styles applied to all sections
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
