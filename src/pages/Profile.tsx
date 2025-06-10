
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { User, Mail, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });
        setNewPassword('');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar selectedView="profile" onViewChange={() => {}} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="text-center">Loading profile...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar selectedView="profile" onViewChange={() => {}} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">
                Manage your account information and settings
              </p>
            </div>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your basic account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>User ID</Label>
                    <div className="p-2 bg-muted rounded text-sm font-mono">
                      {profile?.id}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <div className="p-2 bg-muted rounded">
                      {profile?.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Account Created
                    </Label>
                    <div className="p-2 bg-muted rounded">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Sign In
                    </Label>
                    <div className="p-2 bg-muted rounded">
                      {profile?.last_sign_in_at ? new Date(profile.last_sign_in_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={updating}>
                    {updating ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
