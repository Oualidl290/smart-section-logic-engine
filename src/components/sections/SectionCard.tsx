import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  BarChart3, 
  Copy,
  MoreHorizontal,
  Power,
  PowerOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Section } from '@/types'; // Updated import path
import { EditSectionDialog } from './EditSectionDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { AnalyticsDialog } from './AnalyticsDialog';
import { SectionIdDisplay } from './SectionIdDisplay';
import { useSectionActions } from '@/hooks/useSectionActions';
import { useToast } from '@/hooks/use-toast';

interface SectionCardProps {
  section: Section;
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
}

export const SectionCard = ({ section, onEdit, onDelete }: SectionCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const { duplicateSection, toggleSection } = useSectionActions();
  const { toast } = useToast();

  const handleDuplicate = () => {
    duplicateSection(section);
  };

  const handleToggle = () => {
    toggleSection(section.id, !section.is_enabled);
  };

  const getStatusBadge = () => {
    if (section.is_enabled) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="secondary">Inactive</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{section.name}</CardTitle>
              <CardDescription>
                Created {formatDate(section.created_at)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggle}>
                    {section.is_enabled ? (
                      <>
                        <PowerOff className="mr-2 h-4 w-4" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Power className="mr-2 h-4 w-4" />
                        Enable
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAnalyticsDialog(true)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <SectionIdDisplay 
            sectionId={section.id}
            sectionContent={section.content}
            sectionName={section.name}
          />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Last updated {formatDate(section.updated_at)}
            </div>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <div className="line-clamp-3">
                {section.content.substring(0, 150)}...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditSectionDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        section={section}
        onSave={onEdit} // Changed from onSuccess to onSave
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={section.name} // Changed from sectionName to itemName
        onConfirm={() => {
          onDelete(section.id);
          setShowDeleteDialog(false);
        }}
      />

      <AnalyticsDialog
        open={showAnalyticsDialog}
        onOpenChange={setShowAnalyticsDialog}
        section={section} // Changed from separate props to section object
      />
    </>
  );
};