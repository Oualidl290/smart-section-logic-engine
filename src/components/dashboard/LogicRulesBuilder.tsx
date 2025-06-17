
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save,
  TestTube,
  Code,
  Eye,
  Sparkles
} from "lucide-react";
import { ConditionBuilder } from "./ConditionBuilder";
import { useSmartSections } from "@/hooks/useSmartSections";

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

export const LogicRulesBuilder = () => {
  const { sections, updateSection } = useSmartSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([]);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    const section = sections.find(s => s.id === sectionId);
    
    if (section && section.conditions) {
      try {
        // Parse existing conditions
        const existingConditions = section.conditions as any;
        if (existingConditions.groups) {
          setConditionGroups(existingConditions.groups);
        } else {
          // Legacy format conversion
          setConditionGroups([{
            id: 'group_1',
            logic: existingConditions.logic || 'AND',
            conditions: existingConditions.rules || [],
            enabled: true
          }]);
        }
      } catch (error) {
        console.error('Error parsing conditions:', error);
        setConditionGroups([]);
      }
    } else {
      setConditionGroups([]);
    }
  };

  const handleSaveConditions = async () => {
    if (!selectedSectionId) return;

    setSaving(true);
    try {
      const conditionsData = {
        groups: conditionGroups,
        version: "2.0"
      };

      await updateSection(selectedSectionId, {
        conditions: conditionsData
      });
      
      console.log('Conditions saved successfully');
    } catch (error) {
      console.error('Error saving conditions:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateRawJSON = () => {
    return JSON.stringify({
      groups: conditionGroups,
      version: "2.0"
    }, null, 2);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Logic Rules Builder
          </CardTitle>
          <CardDescription>
            Create conditional logic to control when sections are displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Section</Label>
              <Select value={selectedSectionId} onValueChange={handleSectionSelect}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Choose a section to configure..." />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={section.is_enabled ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {section.is_enabled ? "Active" : "Disabled"}
                        </Badge>
                        {section.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSection && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1">{selectedSection.name}</h4>
                <p className="text-sm text-blue-600">
                  {selectedSection.content.length > 100 
                    ? `${selectedSection.content.substring(0, 100)}...` 
                    : selectedSection.content
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedSectionId && (
        <div className="space-y-6">
          <ConditionBuilder 
            conditionGroups={conditionGroups}
            onChange={setConditionGroups}
          />

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showRawJSON}
                    onCheckedChange={setShowRawJSON}
                  />
                  <Label className="text-sm font-medium">Show Raw JSON</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-lg"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Logic
                  </Button>
                  <Button
                    onClick={handleSaveConditions}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Conditions"}
                  </Button>
                </div>
              </div>

              {showRawJSON && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Raw JSON Configuration</Label>
                  <Textarea
                    value={generateRawJSON()}
                    readOnly
                    className="font-mono text-sm bg-slate-50 min-h-[200px] rounded-lg"
                  />
                  <p className="text-xs text-slate-600">
                    Copy this JSON for use in your WordPress plugin or custom integrations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
