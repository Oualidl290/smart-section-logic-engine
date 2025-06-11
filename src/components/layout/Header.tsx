
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, signOut } = useAuth();
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
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart Section Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, <span className="font-medium">{user?.email}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationSystem
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDismiss={dismissNotification}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/50">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src="" alt={user?.email || ''} />
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card border-0 shadow-xl" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-4">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  User ID: {user?.id?.slice(0, 8)}...
                </p>
              </div>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="cursor-pointer hover:bg-white/50"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer hover:bg-white/50 text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
