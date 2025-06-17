
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Move3D,
  Globe,
  Clock,
  Monitor,
  Calendar,
  Users,
  Code,
  MapPin,
  Languages,
  ExternalLink
} from "lucide-react";

interface LogicCondition {
  id: string;
  type: string;
  operator: string;
  value: string | string[];
  enabled: boolean;
}

interface LogicGroup {
  id: string;
  type: "AND" | "OR";
  conditions: LogicCondition[];
  enabled: boolean;
}

export const LogicRulesBuilder = () => {
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [logicGroups, setLogicGroups] = useState<LogicGroup[]>([]);

  const conditionTypes = [
    { value: "page_url", label: "Page URL", icon: Globe },
    { value: "date_time", label: "Date & Time", icon: Clock },
    { value: "device", label: "Device Type", icon: Monitor },
    { value: "browser", label: "Browser", icon: ExternalLink },
    { value: "referrer", label: "Referral Source", icon: ExternalLink },
    { value: "location", label: "Country/Region", icon: MapPin },
    { value: "language", label: "Language", icon: Languages },
    { value: "user_status", label: "Login Status", icon: Users },
    { value: "custom_js", label: "Custom JavaScript", icon: Code },
  ];

  const operators = {
    page_url: ["is", "contains", "starts_with", "ends_with"],
    date_time: ["between_dates", "between_times", "specific_days"],
    device: ["is", "is_not"],
    browser: ["is", "is_not"],
    referrer: ["contains", "is", "starts_with"],
    location: ["is", "is_not"],
    language: ["is", "is_not"],
    user_status: ["is_logged_in", "is_not_logged_in"],
    custom_js: ["returns_true"]
  };

  const addLogicGroup = () => {
    const newGroup: LogicGroup = {
      id: `group_${Date.now()}`,
      type: "AND",
      conditions: [],
      enabled: true
    };
    setLogicGroups([...logicGroups, newGroup]);
  };

  const addCondition = (groupId: string) => {
    const newCondition: LogicCondition = {
      id: `condition_${Date.now()}`,
      type: "",
      operator: "",
      value: "",
      enabled: true
    };

    setLogicGroups(groups => 
      groups.map(group => 
        group.id === groupId 
          ? { ...group, conditions: [...group.conditions, newCondition] }
          : group
      )
    );
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<LogicCondition>) => {
    setLogicGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map(condition =>
                condition.id === conditionId
                  ? { ...condition, ...updates }
                  : condition
              )
            }
          : group
      )
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setLogicGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? { ...group, conditions: group.conditions.filter(c => c.id !== conditionId) }
          : group
      )
    );
  };

  const removeGroup = (groupId: string) => {
    setLogicGroups(groups => groups.filter(g => g.id !== groupId));
  };

  const renderConditionInputs = (condition: LogicCondition, groupId: string) => {
    switch (condition.type) {
      case "page_url":
        return (
          <Input
            placeholder="e.g., /pricing, contact, shop"
            value={condition.value as string}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="rounded-lg"
          />
        );
      
      case "device":
        return (
          <Select 
            value={condition.value as string} 
            onValueChange={(value) => updateCondition(groupId, condition.id, { value })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
        );

      case "browser":
        return (
          <Select 
            value={condition.value as string} 
            onValueChange={(value) => updateCondition(groupId, condition.id, { value })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select browser" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chrome">Chrome</SelectItem>
              <SelectItem value="firefox">Firefox</SelectItem>
              <SelectItem value="safari">Safari</SelectItem>
              <SelectItem value="edge">Edge</SelectItem>
            </SelectContent>
          </Select>
        );

      case "custom_js":
        return (
          <Textarea
            placeholder="return window.location.pathname === '/special';"
            value={condition.value as string}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="rounded-lg font-mono text-sm"
            rows={3}
          />
        );

      default:
        return (
          <Input
            placeholder="Enter value..."
            value={condition.value as string}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="rounded-lg"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Logic Rules Builder</CardTitle>
          <CardDescription>
            Create conditional logic to control when sections are displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Choose a section to configure..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="section1">Hero Banner</SelectItem>
                  <SelectItem value="section2">Pricing Table</SelectItem>
                  <SelectItem value="section3">Newsletter Popup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSection && (
        <div className="space-y-4">
          {logicGroups.map((group, groupIndex) => (
            <Card key={group.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Group {groupIndex + 1}
                    </Badge>
                    <Select
                      value={group.type}
                      onValueChange={(value) => {
                        setLogicGroups(groups =>
                          groups.map(g =>
                            g.id === group.id ? { ...g, type: value as "AND" | "OR" } : g
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-20 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-slate-600">
                      {group.type === "AND" ? "All conditions must match" : "Any condition can match"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={group.enabled}
                      onCheckedChange={(enabled) => {
                        setLogicGroups(groups =>
                          groups.map(g => g.id === group.id ? { ...g, enabled } : g)
                        );
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeGroup(group.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-3">
                        <Label className="text-xs font-medium text-slate-600 mb-1 block">CONDITION TYPE</Label>
                        <Select
                          value={condition.type}
                          onValueChange={(value) => updateCondition(group.id, condition.id, { type: value, operator: "", value: "" })}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditionTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Label className="text-xs font-medium text-slate-600 mb-1 block">OPERATOR</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value) => updateCondition(group.id, condition.id, { operator: value })}
                          disabled={!condition.type}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {condition.type && operators[condition.type as keyof typeof operators]?.map((op) => (
                              <SelectItem key={op} value={op}>
                                {op.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-5">
                        <Label className="text-xs font-medium text-slate-600 mb-1 block">VALUE</Label>
                        {renderConditionInputs(condition, group.id)}
                      </div>

                      <div className="col-span-1">
                        <Label className="text-xs font-medium text-slate-600 mb-1 block">ENABLED</Label>
                        <Switch
                          checked={condition.enabled}
                          onCheckedChange={(enabled) => updateCondition(group.id, condition.id, { enabled })}
                        />
                      </div>

                      <div className="col-span-1">
                        <Label className="text-xs font-medium text-slate-600 mb-1 block">ACTIONS</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCondition(group.id, condition.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => addCondition(group.id)}
                  className="w-full rounded-lg border-dashed border-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={addLogicGroup}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl h-12"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Logic Group
          </Button>
        </div>
      )}
    </div>
  );
};
