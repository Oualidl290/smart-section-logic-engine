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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface CreateSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

interface Condition {
  type: string;
  operator: string;
  value: string;
}

export const CreateSectionDialog = ({ open, onOpenChange, onSubmit }: CreateSectionDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [newCondition, setNewCondition] = useState<Condition>({
    type: "",
    operator: "",
    value: ""
  });

  const conditionTypes = [
    "device_type",
    "user_role", 
    "page_url",
    "date_range",
    "time_of_day",
    "user_location",
    "referrer"
  ];

  const operators = {
    device_type: ["equals", "not_equals"],
    user_role: ["equals", "not_equals", "in", "not_in"],
    page_url: ["contains", "equals", "starts_with", "ends_with"],
    date_range: ["between", "before", "after"],
    time_of_day: ["between", "before", "after"],
    user_location: ["equals", "not_equals", "in"],
    referrer: ["contains", "equals", "not_equals"]
  };

  const handleAddCondition = () => {
    if (newCondition.type && newCondition.operator && newCondition.value) {
      setConditions([...conditions, { ...newCondition }]);
      setNewCondition({ type: "", operator: "", value: "" });
    }
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      content,
      conditions
    });
    
    // Reset form
    setName("");
    setDescription("");
    setContent("");
    setConditions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Section</DialogTitle>
          <DialogDescription>
            Create a new smart section with conditional logic
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Section Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Holiday Banner"
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="HTML content or Elementor shortcode"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <Label>Display Conditions</Label>
            
            {/* Existing Conditions */}
            {conditions.length > 0 && (
              <div className="space-y-2">
                {conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Badge variant="outline">{condition.type}</Badge>
                    <span className="text-sm">{condition.operator}</span>
                    <span className="text-sm font-medium">{condition.value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto"
                      onClick={() => handleRemoveCondition(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Condition */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Select
                value={newCondition.type}
                onValueChange={(value) => setNewCondition({ ...newCondition, type: value, operator: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condition type" />
                </SelectTrigger>
                <SelectContent>
                  {conditionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newCondition.operator}
                onValueChange={(value) => setNewCondition({ ...newCondition, operator: value })}
                disabled={!newCondition.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {newCondition.type && operators[newCondition.type as keyof typeof operators]?.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={newCondition.value}
                onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                placeholder="Value"
                disabled={!newCondition.operator}
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleAddCondition}
                disabled={!newCondition.type || !newCondition.operator || !newCondition.value}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !content}>
              Create Section
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
