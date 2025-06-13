
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Zap, BarChart3, Eye, Sparkles, TrendingUp, ArrowRight, Users, Activity } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CreateSectionDialog } from "@/components/sections/CreateSectionDialog";
import { EditSectionDialog } from "@/components/sections/EditSectionDialog";
import { AnalyticsDialog } from "@/components/sections/AnalyticsDialog";
import { DeleteConfirmDialog } from "@/components/sections/DeleteConfirmDialog";
import { SectionCard } from "@/components/sections/SectionCard";
import { useSmartSections } from "@/hooks/useSmartSections";
import { useSectionAnalytics } from "@/hooks/useSectionAnalytics";
import { useSectionActions } from "@/hooks/useSectionActions";
import { useAuth } from "@/contexts/AuthContext";
import { SmartSection } from "@/types/section";

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SmartSection | null>(null);
  const [selectedView, setSelectedView] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sections, loading, createSection, updateSection } = useSmartSections();
  const { analytics } = useSectionAnalytics();
  const { toggleSection, duplicateSection, confirmDelete, isDeleting } = useSectionActions();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleCreateSection = async (sectionData: any) => {
    const {
      name,
      description,
      content,
      conditions
    } = sectionData;

    // Convert conditions array to the format expected by your backend
    const conditionsObject = conditions.reduce((acc: any, condition: any) => {
      acc[condition.type] = {
        operator: condition.operator,
        value: condition.value
      };
      return acc;
    }, {});
    await createSection({
      name,
      content,
      conditions: conditionsObject
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditSection = (section: SmartSection) => {
    setSelectedSection(section);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSection = async (sectionId: string, updates: Partial<SmartSection>) => {
    await updateSection(sectionId, updates);
    setIsEditDialogOpen(false);
    setSelectedSection(null);
  };

  const handleViewAnalytics = (section: SmartSection) => {
    setSelectedSection(section);
    setIsAnalyticsDialogOpen(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setSelectedSection(section);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSection) {
      await confirmDelete(selectedSection.id);
      setIsDeleteDialogOpen(false);
      setSelectedSection(null);
    }
  };

  const totalViews = analytics.views;
  const totalConversions = Math.floor(analytics.views * 0.05); // Approximate conversion rate

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      <div className="flex-1 flex flex-col relative z-10">
        <Header />
        
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {selectedView === "overview" && (
            <div className="space-y-10 animate-fade-in-up">
              {/* Enhanced Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-10 text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="space-y-6 max-w-3xl">
                      <div className="flex items-center gap-4 animate-slide-up">
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 animate-glow">
                          <Sparkles className="h-10 w-10 text-yellow-300" />
                        </div>
                        <div>
                          <h1 className="text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            Smart Engine
                          </h1>
                          <p className="text-2xl font-semibold text-blue-100">
                            AI-Powered Content Revolution
                          </p>
                        </div>
                      </div>
                      <p className="text-xl leading-relaxed text-blue-50 max-w-2xl animate-fade-in-up delay-300">
                        Create intelligent content sections that automatically adapt based on user behavior, 
                        device type, location, and more. Transform your engagement with personalized experiences 
                        powered by cutting-edge AI technology.
                      </p>
                      <div className="flex flex-wrap gap-3 animate-fade-in-up delay-500">
                        <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30 px-4 py-2 text-sm font-medium">
                          <Activity className="h-4 w-4 mr-2" />
                          Real-time Analytics
                        </Badge>
                        <Badge className="bg-green-400/20 text-green-100 border-green-400/30 px-4 py-2 text-sm font-medium">
                          <Users className="h-4 w-4 mr-2" />
                          User Targeting
                        </Badge>
                        <Badge className="bg-purple-400/20 text-purple-100 border-purple-400/30 px-4 py-2 text-sm font-medium">
                          <Zap className="h-4 w-4 mr-2" />
                          AI-Powered
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 animate-fade-in-up delay-700">
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)} 
                        size="lg" 
                        className="bg-white text-indigo-600 hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl h-14 px-10 group font-bold text-lg border-0"
                      >
                        <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        Create Section
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => navigate('/analytics')} 
                        className="border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 h-14 px-10 font-bold text-lg text-white border-2 rounded-2xl group"
                      >
                        <BarChart3 className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        Analytics Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group hover:scale-105 transition-all duration-500 animate-scale-in">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10"></div>
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 font-semibold">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <h3 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {sections.length}
                        </h3>
                        <p className="text-lg font-semibold text-slate-700">Smart Sections</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-semibold">
                            {sections.filter(s => s.is_enabled).length} actively running
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="group hover:scale-105 transition-all duration-500 animate-scale-in delay-200">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/10"></div>
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 font-semibold">
                          Growing
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {totalViews.toLocaleString()}
                        </h3>
                        <p className="text-lg font-semibold text-slate-700">Total Views</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-semibold">
                            {analytics.uniqueViews} unique visitors
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="group hover:scale-105 transition-all duration-500 animate-scale-in delay-400">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/10"></div>
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                          <BarChart3 className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50 font-semibold">
                          Optimized
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <h3 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {totalConversions}
                        </h3>
                        <p className="text-lg font-semibold text-slate-700">Conversions</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-semibold">
                            ~5% conversion rate
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Enhanced Sections List */}
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardHeader className="p-10 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <CardTitle className="text-3xl font-black text-slate-800">Your Smart Sections</CardTitle>
                      <CardDescription className="text-lg text-slate-600 max-w-2xl">
                        Manage and monitor your dynamic content sections with real-time analytics 
                        and performance insights
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-2xl h-12 px-8 font-bold shadow-lg hover:shadow-xl group"
                    >
                      <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      New Section
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-10">
                  {loading ? (
                    <div className="text-center py-20">
                      <div className="relative mx-auto w-16 h-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                      </div>
                      <p className="mt-6 text-slate-600 font-semibold text-lg">Loading your sections...</p>
                    </div>
                  ) : sections.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="relative mx-auto w-32 h-32 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                          <Sparkles className="h-16 w-16 text-blue-600 animate-bounce" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-black mb-4 text-slate-800">Ready to get started?</h3>
                      <p className="text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed text-lg">
                        Create your first smart section and experience the power of AI-driven content 
                        that automatically adapts to your users for maximum engagement.
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)} 
                        size="lg" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-2xl h-14 px-10 font-bold text-lg shadow-lg hover:shadow-xl group"
                      >
                        <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        Create Your First Section
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {sections.map((section, index) => (
                        <div key={section.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                          <SectionCard 
                            section={section} 
                            onEdit={handleEditSection} 
                            onDelete={handleDeleteSection} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedView === "sections" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Sections Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Smart Sections</h1>
                  <p className="text-muted-foreground">
                    Manage all your dynamic content sections in one place
                  </p>
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl h-11 px-6 font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Section
                </Button>
              </div>

              {/* Sections Content */}
              <div className="professional-card p-8">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading sections...</p>
                  </div>
                ) : sections.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-6 bg-gradient-primary rounded-3xl w-24 h-24 mx-auto mb-6 animate-float">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No sections created yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                      Get started by creating your first smart section. Build dynamic content that 
                      automatically adapts to your users for maximum engagement.
                    </p>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)} 
                      size="lg" 
                      className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl h-12 px-8 font-semibold"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Section
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sections.map((section, index) => (
                      <div key={section.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <SectionCard 
                          section={section} 
                          onEdit={handleEditSection} 
                          onDelete={handleDeleteSection} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedView === "analytics" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Coming soon - Advanced analytics and reporting</p>
            </div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <CreateSectionDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSubmit={handleCreateSection} 
      />

      <EditSectionDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        section={selectedSection} 
        onSubmit={handleUpdateSection} 
      />

      <AnalyticsDialog 
        open={isAnalyticsDialogOpen} 
        onOpenChange={setIsAnalyticsDialogOpen} 
        section={selectedSection} 
      />

      <DeleteConfirmDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        section={selectedSection} 
        onConfirm={handleConfirmDelete} 
        isDeleting={isDeleting === selectedSection?.id} 
      />
    </div>
  );
};

export default Index;
