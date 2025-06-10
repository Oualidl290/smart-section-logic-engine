
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSectionAnalytics } from '@/hooks/useSectionAnalytics';
import { useSmartSections } from '@/hooks/useSmartSections';
import { AnalyticsDialog } from '@/components/sections/AnalyticsDialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Eye, TrendingUp, Activity, Users, MousePointer } from 'lucide-react';

const Analytics = () => {
  const { sections } = useSmartSections();
  const { analytics, loading } = useSectionAnalytics();
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedSectionForDialog, setSelectedSectionForDialog] = useState(null);

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--chart-1))",
    },
    conversions: {
      label: "Conversions",
      color: "hsl(var(--chart-2))",
    },
  };

  const pieChartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // Mock data for charts - in real app this would come from analytics
  const viewsData = [
    { name: 'Mon', views: 120, conversions: 6 },
    { name: 'Tue', views: 150, conversions: 8 },
    { name: 'Wed', views: 180, conversions: 9 },
    { name: 'Thu', views: 165, conversions: 7 },
    { name: 'Fri', views: 200, conversions: 12 },
    { name: 'Sat', views: 110, conversions: 5 },
    { name: 'Sun', views: 95, conversions: 4 },
  ];

  const sectionPerformanceData = sections.map((section, index) => ({
    name: section.name.substring(0, 15) + (section.name.length > 15 ? '...' : ''),
    views: Math.floor(Math.random() * 100) + 20,
    fill: pieChartColors[index % pieChartColors.length],
  }));

  const handleViewSectionAnalytics = (section) => {
    setSelectedSectionForDialog(section);
    setAnalyticsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar selectedView="analytics" onViewChange={() => {}} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="text-center">Loading analytics...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar selectedView="analytics" onViewChange={() => {}} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <BarChart3 className="h-8 w-8" />
                  Analytics
                </h1>
                <p className="text-muted-foreground">
                  Monitor your sections performance and user engagement
                </p>
              </div>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.views}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.uniqueViews}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sections</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sections.filter(s => s.is_enabled).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {sections.length} total sections
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Views Over Time</CardTitle>
                  <CardDescription>Daily views and conversions for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
                        <Line type="monotone" dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Section Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Section Performance</CardTitle>
                  <CardDescription>Views distribution across sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sectionPerformanceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="views"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sectionPerformanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sections Analytics Table */}
            <Card>
              <CardHeader>
                <CardTitle>Section Analytics</CardTitle>
                <CardDescription>Detailed performance metrics for each section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium">{section.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {section.content.substring(0, 60)}...
                          </p>
                        </div>
                        <Badge variant={section.is_enabled ? "default" : "secondary"}>
                          {section.is_enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{Math.floor(Math.random() * 100) + 20} views</p>
                          <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 10) + 1} conversions</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSectionAnalytics(section)}
                        >
                          <MousePointer className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AnalyticsDialog
        open={analyticsDialogOpen}
        onOpenChange={setAnalyticsDialogOpen}
        section={selectedSectionForDialog}
      />
    </div>
  );
};

export default Analytics;
