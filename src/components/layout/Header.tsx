
import { User, LogOut, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification 
  } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-border/50 px-6 py-3 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Section Engine
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              AI-Powered Content Management
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button 
            variant="ghost" 
            className="text-sm font-medium hover:bg-primary/10 hover:text-primary"
            onClick={() => navigate('/')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="text-sm font-medium hover:bg-primary/10 hover:text-primary"
            onClick={() => navigate('/analytics')}
          >
            Analytics
          </Button>
          <Button 
            variant="ghost" 
            className="text-sm font-medium hover:bg-primary/10 hover:text-primary"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <NotificationSystem
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDismiss={dismissNotification}
            />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage 
                    src={profile?.avatar_url || ''} 
                    alt={profile?.first_name || user?.email || 'User'} 
                  />
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card border-0 shadow-xl" align="end" forceMount>
              <div className="flex flex-col space-y-2 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-none">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : user?.email
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border/50" />
              <div className="p-1">
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer hover:bg-primary/10 rounded-lg font-medium"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer hover:bg-primary/10 rounded-lg font-medium"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer hover:bg-destructive/10 text-destructive rounded-lg font-medium"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
