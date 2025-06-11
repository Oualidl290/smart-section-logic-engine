import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSectionAnalytics } from '@/hooks/useSectionAnalytics';
import { useSmartSections } from '@/hooks/useSmartSections';
import { useProfile } from '@/hooks/useProfile';
import { AnalyticsDialog } from '@/components/sections/AnalyticsDialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Eye, TrendingUp, Activity, Users, MousePointer, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { sections } = useSmartSections();
  const { analytics, loading, refetch } = useSectionAnalytics();
  const { profile } = useProfile();
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedSectionForDialog, setSelectedSectionForDialog] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

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

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  // Interactive chart data that responds to filters
  const getViewsData = () => {
    const baseData = [
      { name: 'Mon', views: 120, conversions: 6 },
      { name: 'Tue', views: 150, conversions: 8 },
      { name: 'Wed', views: 180, conversions: 9 },
      { name: 'Thu', views: 165, conversions: 7 },
      { name: 'Fri', views: 200, conversions: 12 },
      { name: 'Sat', views: 110, conversions: 5 },
      { name: 'Sun', views: 95, conversions: 4 },
    ];

    // Adjust data based on time range
    const multiplier = timeRange === '30d' ? 4.2 : timeRange === '7d' ? 1 : 0.3;
    return baseData.map(item => ({
      ...item,
      views: Math.floor(item.views * multiplier),
      conversions: Math.floor(item.conversions * multiplier)
    }));
  };

  const getSectionPerformanceData = () => {
    const filteredSections = selectedSection === 'all' 
      ? sections 
      : sections.filter(s => s.id === selectedSection);
    
    return filteredSections.map((section, index) => ({
      name: section.name.substring(0, 15) + (section.name.length > 15 ? '...' : ''),
      views: Math.floor(Math.random() * 100) + 20,
      fill: pieChartColors[index % pieChartColors.length],
      sectionId: section.id,
    }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Analytics Refreshed",
        description: "Latest data has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh analytics data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = () => {
    const data = {
      analytics,
      sections: sections.length,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Analytics data has been downloaded as JSON.",
    });
  };

  const handleViewSectionAnalytics = (section) => {
    setSelectedSectionForDialog(section);
    setAnalyticsDialogOpen(true);
    toast({
      title: "Section Details",
      description: `Viewing analytics for "${section.name}"`,
    });
  };

  const handleChartClick = (data, chart) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload;
      toast({
        title: `${chart} Data Point`,
        description: `${payload.name}: ${payload.views} views, ${payload.conversions} conversions`,
      });
    }
  };

  const handlePieChartClick = (data) => {
    if (data && data.sectionId) {
      const section = sections.find(s => s.id === data.sectionId);
      if (section) {
        handleViewSectionAnalytics(section);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 flex">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 flex">
      <Sidebar selectedView="analytics" onViewChange={() => {}} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header with Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                  <AvatarImage 
                    src={profile?.avatar_url || ''} 
                    alt={profile?.first_name || 'User'} 
                  />
                  <AvatarFallback className="bg-gradient-primary text-white font-bold text-xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 font-heading">
                    <BarChart3 className="h-10 w-10 text-primary" />
                    Analytics Dashboard
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium">
                    Monitor your sections performance and user engagement in real-time
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 glass-card border-0">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last Day</SelectItem>
                    <SelectItem value="7d">Last Week</SelectItem>
                    <SelectItem value="30d">Last Month</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-48 glass-card border-0">
                    <Filter className="h-4 w-4 mr-2" />
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
                
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="glass-card border-0 hover:bg-white/50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="glass-card border-0 hover:bg-white/50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Overview Stats with enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group" onClick={() => toast({ title: "Total Views", description: `${analytics.views} total page views recorded` })}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-heading">Total Views</CardTitle>
                  <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading">{analytics.views}</div>
                  <p className="text-xs text-muted-foreground font-medium">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group" onClick={() => toast({ title: "Unique Visitors", description: `${analytics.uniqueViews} unique visitors tracked` })}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-heading">Unique Visitors</CardTitle>
                  <div className="p-2 bg-gradient-secondary rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent font-heading">{analytics.uniqueViews}</div>
                  <p className="text-xs text-muted-foreground font-medium">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group" onClick={() => toast({ title: "Conversion Rate", description: "5.2% average conversion rate across all sections" })}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-heading">Conversion Rate</CardTitle>
                  <div className="p-2 bg-gradient-accent rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent font-heading">5.2%</div>
                  <p className="text-xs text-muted-foreground font-medium">
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group" onClick={() => toast({ title: "Active Sections", description: `${sections.filter(s => s.is_enabled).length} sections currently active` })}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-heading">Active Sections</CardTitle>
                  <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent font-heading">
                    {sections.filter(s => s.is_enabled).length}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    of {sections.length} total sections
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time - Interactive */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Views Over Time (Interactive)</CardTitle>
                  <CardDescription className="font-medium">Click on data points for details • Showing {timeRange} data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getViewsData()} onClick={(data) => handleChartClick(data, 'Timeline')}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          stroke="var(--color-views)" 
                          strokeWidth={3}
                          dot={{ r: 6, cursor: 'pointer' }}
                          activeDot={{ r: 8, cursor: 'pointer' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="conversions" 
                          stroke="var(--color-conversions)" 
                          strokeWidth={3}
                          dot={{ r: 6, cursor: 'pointer' }}
                          activeDot={{ r: 8, cursor: 'pointer' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Section Performance - Interactive Pie Chart */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Section Performance (Interactive)</CardTitle>
                  <CardDescription className="font-medium">Click on slices to view section details • Filtered: {selectedSection === 'all' ? 'All Sections' : sections.find(s => s.id === selectedSection)?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getSectionPerformanceData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="views"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          onClick={handlePieChartClick}
                          className="cursor-pointer"
                        >
                          {getSectionPerformanceData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.fill}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Sections Table */}
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Interactive Sections Analytics</CardTitle>
                <CardDescription className="font-medium">Click on any section for detailed analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div 
                      key={section.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer glass-card border-0"
                      onClick={() => handleViewSectionAnalytics(section)}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold font-heading">{section.name}</h3>
                          <p className="text-sm text-muted-foreground font-medium">
                            {section.content.substring(0, 60)}...
                          </p>
                        </div>
                        <Badge variant={section.is_enabled ? "default" : "secondary"}>
                          {section.is_enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold font-heading">{Math.floor(Math.random() * 100) + 20} views</p>
                          <p className="text-xs text-muted-foreground font-medium">{Math.floor(Math.random() * 10) + 1} conversions</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSectionAnalytics(section);
                          }}
                          className="glass-card border-0 hover:bg-white/50 font-medium"
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
