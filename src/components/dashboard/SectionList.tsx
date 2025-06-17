
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter,
  Plus,
  Edit,
  BarChart3,
  Eye,
  Calendar,
  Globe,
  Settings,
  Trash2,
  Copy,
  Layers
} from "lucide-react";
import { useSmartSections } from "@/hooks/useSmartSections";
import { SmartSection } from "@/types/section";
import { formatDistanceToNow } from "date-fns";

interface SectionListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterEnabled: boolean | null;
  onFilterChange: (enabled: boolean | null) => void;
}

export const SectionList = ({ 
  searchQuery, 
  onSearchChange, 
  filterEnabled, 
  onFilterChange 
}: SectionListProps) => {
  const { sections, loading, updateSection } = useSmartSections();
  const [filteredSections, setFilteredSections] = useState<SmartSection[]>([]);

  useEffect(() => {
    let filtered = sections;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(section => 
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply enabled filter
    if (filterEnabled !== null) {
      filtered = filtered.filter(section => section.is_enabled === filterEnabled);
    }

    setFilteredSections(filtered);
  }, [sections, searchQuery, filterEnabled]);

  const handleToggleEnabled = async (section: SmartSection) => {
    await updateSection(section.id, { is_enabled: !section.is_enabled });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">
                Smart Sections
              </CardTitle>
              <CardDescription className="text-slate-600">
                Manage your conditional content sections
              </CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              New Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:border-blue-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <Label htmlFor="filter-all" className="text-sm font-medium">All</Label>
              <Switch
                id="filter-all"
                checked={filterEnabled === null}
                onCheckedChange={() => onFilterChange(null)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="filter-enabled" className="text-sm font-medium">Enabled</Label>
              <Switch
                id="filter-enabled"
                checked={filterEnabled === true}
                onCheckedChange={() => onFilterChange(true)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="filter-disabled" className="text-sm font-medium">Disabled</Label>
              <Switch
                id="filter-disabled"
                checked={filterEnabled === false}
                onCheckedChange={() => onFilterChange(false)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading sections...</p>
        </div>
      ) : filteredSections.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-16 h-16 mx-auto mb-4">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">No sections found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || filterEnabled !== null 
                ? "Try adjusting your search or filters" 
                : "Create your first smart section to get started"
              }
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <Card 
              key={section.id} 
              className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {section.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600 mt-1">
                      {section.content.length > 60 
                        ? `${section.content.substring(0, 60)}...` 
                        : section.content
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={section.is_enabled ? "default" : "secondary"}
                      className={section.is_enabled 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                      }
                    >
                      {section.is_enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(section.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>
                      {Object.keys(section.conditions || {}).length} conditions
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`toggle-${section.id}`} className="text-sm font-medium">
                      Enabled
                    </Label>
                    <Switch
                      id={`toggle-${section.id}`}
                      checked={section.is_enabled}
                      onCheckedChange={() => handleToggleEnabled(section)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                    <Settings className="h-3 w-3 mr-1" />
                    Logic
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Usage
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
