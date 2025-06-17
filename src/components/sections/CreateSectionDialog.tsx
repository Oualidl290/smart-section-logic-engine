
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConditionBuilder } from "@/components/dashboard/ConditionBuilder";

interface CreateSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

interface ConditionGroup {
  id: string;
  logic: "AND" | "OR";
  conditions: Array<{
    id: string;
    type: string;
    operator: string;
    value: string | string[];
    enabled: boolean;
  }>;
  enabled: boolean;
}

export const CreateSectionDialog = ({ open, onOpenChange, onSubmit }: CreateSectionDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const conditionsData = {
      groups: conditionGroups,
      version: "2.0"
    };

    onSubmit({
      name,
      description,
      content,
      conditions: conditionsData
    });
    
    // Reset form
    setName("");
    setDescription("");
    setContent("");
    setConditionGroups([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Smart Section</DialogTitle>
          <DialogDescription>
            Create a new section with content and conditional logic
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="conditions">Display Conditions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Section Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Section Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Holiday Banner, Mobile CTA"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of this section"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">HTML Content *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="HTML content, Elementor shortcode, or custom code..."
                      rows={6}
                      required
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can use HTML, Elementor shortcodes, or any WordPress content
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">When to Display This Section</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add conditions to control when this section is visible. If no conditions are added, the section will always be displayed.
                  </p>
                </CardHeader>
                <CardContent>
                  <ConditionBuilder 
                    conditionGroups={conditionGroups}
                    onChange={setConditionGroups}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {conditionGroups.length > 0 
                ? `${conditionGroups.length} condition group(s) configured`
                : "No conditions set - section will always display"
              }
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name || !content}>
                Create Section
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
