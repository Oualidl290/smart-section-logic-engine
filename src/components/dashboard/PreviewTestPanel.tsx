import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlayCircle, 
  Eye, 
  EyeOff, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface TestEnvironment {
  url: string;
  device: string;
  browser: string;
  time: string;
  date: string;
  referrer: string;
  language: string;
  userLoggedIn: boolean;
}

interface TestResult {
  sectionId: string;
  sectionName: string;
  visible: boolean;
  matchedConditions: string[];
  failedConditions: string[];
}

export const PreviewTestPanel = () => {
  const [testEnv, setTestEnv] = useState<TestEnvironment>({
    url: "",
    device: "desktop",
    browser: "chrome",
    time: "12:00",
    date: new Date().toISOString().split('T')[0],
    referrer: "",
    language: "en",
    userLoggedIn: false
  });

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sections = [
    { id: "1", name: "Hero Banner", hasConditions: true },
    { id: "2", name: "Pricing Table", hasConditions: true },
    { id: "3", name: "Newsletter Popup", hasConditions: false },
    { id: "4", name: "Footer CTA", hasConditions: true }
  ];

  const runTest = async () => {
    setIsRunning(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults: TestResult[] = [
      {
        sectionId: "1",
        sectionName: "Hero Banner",
        visible: true,
        matchedConditions: ["Device is desktop", "URL contains pricing"],
        failedConditions: []
      },
      {
        sectionId: "2", 
        sectionName: "Pricing Table",
        visible: false,
        matchedConditions: ["Device is desktop"],
        failedConditions: ["Time not between 9AM-5PM", "User not logged in"]
      },
      {
        sectionId: "3",
        sectionName: "Newsletter Popup", 
        visible: true,
        matchedConditions: ["No conditions set - always visible"],
        failedConditions: []
      },
      {
        sectionId: "4",
        sectionName: "Footer CTA",
        visible: true,
        matchedConditions: ["Language is English", "Device is desktop"],
        failedConditions: []
      }
    ];
    
    setTestResults(mockResults);
    setIsRunning(false);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile": return Smartphone;
      case "tablet": return Tablet;
      default: return Monitor;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Preview & Test Environment</CardTitle>
          <CardDescription>
            Simulate different conditions to test section visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Test URL</Label>
              <Input
                placeholder="e.g., /pricing, /contact"
                value={testEnv.url}
                onChange={(e) => setTestEnv({...testEnv, url: e.target.value})}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Device Type</Label>
              <Select value={testEnv.device} onValueChange={(device) => setTestEnv({...testEnv, device})}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Desktop
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile
                    </div>
                  </SelectItem>
                  <SelectItem value="tablet">
                    <div className="flex items-center gap-2">
                      <Tablet className="h-4 w-4" />
                      Tablet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Browser</Label>
              <Select value={testEnv.browser} onValueChange={(browser) => setTestEnv({...testEnv, browser})}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chrome">Chrome</SelectItem>
                  <SelectItem value="firefox">Firefox</SelectItem>
                  <SelectItem value="safari">Safari</SelectItem>
                  <SelectItem value="edge">Edge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Test Date</Label>
              <Input
                type="date"
                value={testEnv.date}
                onChange={(e) => setTestEnv({...testEnv, date: e.target.value})}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Test Time</Label>
              <Input
                type="time"
                value={testEnv.time}
                onChange={(e) => setTestEnv({...testEnv, time: e.target.value})}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Language</Label>
              <Select value={testEnv.language} onValueChange={(language) => setTestEnv({...testEnv, language})}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Referrer URL (optional)</Label>
            <Input
              placeholder="e.g., https://google.com, https://facebook.com"
              value={testEnv.referrer}
              onChange={(e) => setTestEnv({...testEnv, referrer: e.target.value})}
              className="rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Globe className="h-3 w-3 mr-1" />
                {testEnv.url || "No URL"}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {React.createElement(getDeviceIcon(testEnv.device), { className: "h-3 w-3 mr-1" })}
                {testEnv.device}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Clock className="h-3 w-3 mr-1" />
                {testEnv.time}
              </Badge>
            </div>
            <Button 
              onClick={runTest} 
              disabled={isRunning}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
            >
              {isRunning ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <PlayCircle className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "Running Test..." : "Run Test"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Test Results</CardTitle>
            <CardDescription>
              Section visibility based on your test conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result) => (
                <div key={result.sectionId} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${result.visible ? 'bg-green-100' : 'bg-red-100'}`}>
                        {result.visible ? (
                          <Eye className={`h-4 w-4 ${result.visible ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <EyeOff className={`h-4 w-4 ${result.visible ? 'text-green-600' : 'text-red-600'}`} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{result.sectionName}</h4>
                        <p className="text-sm text-slate-600">
                          {result.visible ? "Section will be visible" : "Section will be hidden"}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={result.visible ? "default" : "secondary"}
                      className={result.visible 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {result.visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>

                  {result.matchedConditions.length > 0 && (
                    <div className="mb-3">
                      <Label className="text-xs font-medium text-green-600 mb-1 block">MATCHED CONDITIONS</Label>
                      <div className="space-y-1">
                        {result.matchedConditions.map((condition, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-slate-700">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.failedConditions.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-red-600 mb-1 block">FAILED CONDITIONS</Label>
                      <div className="space-y-1">
                        {result.failedConditions.map((condition, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span className="text-slate-700">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
