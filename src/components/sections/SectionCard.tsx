
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Eye, BarChart3, Copy, Power } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  name: string;
  status: "active" | "draft" | "archived";
  views: number;
  conversions: number;
  conditions: string[];
  lastModified: string;
}

interface SectionCardProps {
  section: Section;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewAnalytics: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDuplicate: (id: string) => void;
}

export const SectionCard = ({ 
  section, 
  onEdit, 
  onDelete, 
  onViewAnalytics, 
  onToggle,
  onDuplicate
}: SectionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggle = () => {
    onToggle(section.id, section.status === "active");
  };

  const handleDuplicate = () => {
    onDuplicate(section.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{section.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(section.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Section
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewAnalytics(section.id)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggle}>
                <Power className="mr-2 h-4 w-4" />
                {section.status === "active" ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(section.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge className={cn("w-fit", getStatusColor(section.status))}>
          {section.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{section.views.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{section.conversions}</div>
            <div className="text-xs text-muted-foreground">Conversions</div>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <div className="text-sm font-medium mb-2">Conditions:</div>
          <div className="flex flex-wrap gap-1">
            {section.conditions.length > 0 ? (
              section.conditions.map((condition, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {condition}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                No conditions
              </Badge>
            )}
          </div>
        </div>

        {/* Last Modified */}
        <div className="text-xs text-muted-foreground">
          Modified {section.lastModified}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(section.id)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewAnalytics(section.id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
