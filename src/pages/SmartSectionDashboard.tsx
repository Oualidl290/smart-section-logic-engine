
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Layers, 
  Settings, 
  Eye, 
  Plus, 
  Search, 
  Filter,
  Sparkles,
  PlayCircle,
  Edit,
  BarChart3
} from "lucide-react";
import { SectionList } from "@/components/dashboard/SectionList";
import { LogicRulesBuilder } from "@/components/dashboard/LogicRulesBuilder";
import { PreviewTestPanel } from "@/components/dashboard/PreviewTestPanel";

const SmartSectionDashboard = () => {
  const [activeTab, setActiveTab] = useState("sections");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEnabled, setFilterEnabled] = useState<boolean | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Smart Section Logic Engine
                </h1>
                <p className="text-slate-600 font-medium">
                  Manage conditional visibility for your WordPress sections
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                WordPress Plugin
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                v2.1.0
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl p-2 shadow-sm">
            <TabsTrigger 
              value="sections" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-200"
            >
              <Layers className="h-4 w-4 mr-2" />
              Section List
            </TabsTrigger>
            <TabsTrigger 
              value="logic" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Logic Rules
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview & Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-6">
            <SectionList 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterEnabled={filterEnabled}
              onFilterChange={setFilterEnabled}
            />
          </TabsContent>

          <TabsContent value="logic" className="space-y-6">
            <LogicRulesBuilder />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <PreviewTestPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SmartSectionDashboard;
