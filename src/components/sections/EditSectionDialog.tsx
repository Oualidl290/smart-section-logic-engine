
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SmartSection } from "@/types/section";

interface EditSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: SmartSection | null;
  onSubmit: (sectionId: string, updates: Partial<SmartSection>) => Promise<void>;
}

export const EditSectionDialog = ({ open, onOpenChange, section, onSubmit }: EditSectionDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    is_enabled: true
  });

  useEffect(() => {
    if (section) {
      setFormData({
        name: section.name,
        content: section.content,
        is_enabled: section.is_enabled
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section) return;

    await onSubmit(section.id, formData);
    onOpenChange(false);
  };

  if (!section) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Make changes to your section. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Section Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter section name"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter section content"
              rows={6}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-enabled"
              checked={formData.is_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_enabled: checked }))}
            />
            <Label htmlFor="edit-enabled">Section Enabled</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
