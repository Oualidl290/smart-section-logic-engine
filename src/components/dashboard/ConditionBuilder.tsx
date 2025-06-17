
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Globe,
  Clock,
  Monitor,
  Languages,
  ExternalLink,
  Code,
  Users,
  Settings
} from "lucide-react";

interface Condition {
  id: string;
  type: string;
  operator: string;
  value: string | string[];
  enabled: boolean;
}

interface ConditionGroup {
  id: string;
  logic: "AND" | "OR";
  conditions: Condition[];
  enabled: boolean;
}

interface ConditionBuilderProps {
  conditionGroups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

export const ConditionBuilder = ({ conditionGroups, onChange }: ConditionBuilderProps) => {
  const conditionTypes = [
    { value: "page_url", label: "Page URL", icon: Globe, operators: ["is", "contains", "starts_with", "ends_with"] },
    { value: "device", label: "Device Type", icon: Monitor, operators: ["is", "is_not"] },
    { value: "browser", label: "Browser", icon: ExternalLink, operators: ["is", "is_not"] },
    { value: "language", label: "Language", icon: Languages, operators: ["is", "is_not"] },
    { value: "referrer", label: "Referrer", icon: ExternalLink, operators: ["contains", "is", "starts_with"] },
    { value: "date_time", label: "Date & Time", icon: Clock, operators: ["between_times", "between_dates", "specific_days"] },
    { value: "user_status", label: "Login Status", icon: Users, operators: ["is_logged_in", "is_not_logged_in"] },
    { value: "elementor_mode", label: "Elementor Edit Mode", icon: Settings, operators: ["is_active"] },
    { value: "custom_js", label: "Custom JavaScript", icon: Code, operators: ["returns_true"] },
  ];

  const deviceOptions = ["desktop", "mobile", "tablet"];
  const browserOptions = ["chrome", "firefox", "safari", "edge"];
  const languageOptions = ["en", "fr", "es", "de", "ar", "zh", "ja"];

  const addGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group_${Date.now()}`,
      logic: "AND",
      conditions: [],
      enabled: true
    };
    onChange([...conditionGroups, newGroup]);
  };

  const removeGroup = (groupId: string) => {
    onChange(conditionGroups.filter(g => g.id !== groupId));
  };

  const updateGroup = (groupId: string, updates: Partial<ConditionGroup>) => {
    onChange(conditionGroups.map(g => 
      g.id === groupId ? { ...g, ...updates } : g
    ));
  };

  const addCondition = (groupId: string) => {
    const newCondition: Condition = {
      id: `condition_${Date.now()}`,
      type: "",
      operator: "",
      value: "",
      enabled: true
    };

    onChange(conditionGroups.map(g =>
      g.id === groupId 
        ? { ...g, conditions: [...g.conditions, newCondition] }
        : g
    ));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    onChange(conditionGroups.map(g =>
      g.id === groupId
        ? { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) }
        : g
    ));
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<Condition>) => {
    onChange(conditionGroups.map(g =>
      g.id === groupId
        ? {
            ...g,
            conditions: g.conditions.map(c =>
              c.id === conditionId ? { ...c, ...updates } : c
            )
          }
        : g
    ));
  };

  const duplicateGroup = (groupId: string) => {
    const groupToDuplicate = conditionGroups.find(g => g.id === groupId);
    if (groupToDuplicate) {
      const duplicatedGroup: ConditionGroup = {
        ...groupToDuplicate,
        id: `group_${Date.now()}`,
        conditions: groupToDuplicate.conditions.map(c => ({
          ...c,
          id: `condition_${Date.now()}_${Math.random()}`
        }))
      };
      onChange([...conditionGroups, duplicatedGroup]);
    }
  };

  const renderConditionInput = (condition: Condition, groupId: string) => {
    const conditionType = conditionTypes.find(t => t.value === condition.type);
    
    switch (condition.type) {
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
              {deviceOptions.map(device => (
                <SelectItem key={device} value={device}>
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </SelectItem>
              ))}
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
              {browserOptions.map(browser => (
                <SelectItem key={browser} value={browser}>
                  {browser.charAt(0).toUpperCase() + browser.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "language":
        return (
          <Select 
            value={condition.value as string} 
            onValueChange={(value) => updateCondition(groupId, condition.id, { value })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date_time":
        if (condition.operator === "between_times") {
          return (
            <div className="flex gap-2 items-center">
              <Input
                type="time"
                value={(condition.value as string)?.split('-')[0] || ""}
                onChange={(e) => {
                  const endTime = (condition.value as string)?.split('-')[1] || "18:00";
                  updateCondition(groupId, condition.id, { value: `${e.target.value}-${endTime}` });
                }}
                className="rounded-lg"
              />
              <span className="text-sm text-slate-500">to</span>
              <Input
                type="time"
                value={(condition.value as string)?.split('-')[1] || ""}
                onChange={(e) => {
                  const startTime = (condition.value as string)?.split('-')[0] || "08:00";
                  updateCondition(groupId, condition.id, { value: `${startTime}-${e.target.value}` });
                }}
                className="rounded-lg"
              />
            </div>
          );
        }
        return (
          <Input
            placeholder="Enter value..."
            value={condition.value as string}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="rounded-lg"
          />
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

      case "user_status":
      case "elementor_mode":
        return (
          <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
            No additional value required
          </div>
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
    <div className="space-y-4">
      {conditionGroups.map((group, groupIndex) => (
        <Card key={group.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Group {groupIndex + 1}
                </Badge>
                <Select
                  value={group.logic}
                  onValueChange={(value: "AND" | "OR") => updateGroup(group.id, { logic: value })}
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
                  {group.logic === "AND" ? "All conditions must match" : "Any condition can match"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateGroup(group.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Switch
                  checked={group.enabled}
                  onCheckedChange={(enabled) => updateGroup(group.id, { enabled })}
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
            {group.conditions.map((condition) => (
              <div key={condition.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-3">
                    <Label className="text-xs font-medium text-slate-600 mb-1 block">CONDITION TYPE</Label>
                    <Select
                      value={condition.type}
                      onValueChange={(value) => updateCondition(group.id, condition.id, { 
                        type: value, 
                        operator: conditionTypes.find(t => t.value === value)?.operators[0] || "", 
                        value: "" 
                      })}
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
                        {condition.type && conditionTypes.find(t => t.value === condition.type)?.operators.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-5">
                    <Label className="text-xs font-medium text-slate-600 mb-1 block">VALUE</Label>
                    {renderConditionInput(condition, group.id)}
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
        onClick={addGroup}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl h-12"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Logic Group
      </Button>
    </div>
  );
};
