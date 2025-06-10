
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  userInitials: string;
}

export const ProfileImageUpload = ({ currentImageUrl, userInitials }: ProfileImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadAvatar } = useProfile();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentImageUrl || undefined} alt="Profile" />
          <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
        </Avatar>
        <Button
          variant="secondary"
          size="icon"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
          onClick={triggerFileSelect}
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        onClick={triggerFileSelect}
        disabled={uploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading..." : "Upload Photo"}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
