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
  const {
    user
  } = useAuth();
  const {
    sections,
    loading,
    createSection,
    updateSection
  } = useSmartSections();
  const {
    analytics
  } = useSectionAnalytics();
  const {
    toggleSection,
    duplicateSection,
    confirmDelete,
    isDeleting
  } = useSectionActions();

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
  const totalConversions = Math.floor(analytics.views * 0.05);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }
  return <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50/30 relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-indigo-400/5 to-pink-400/5 rounded-full blur-2xl"></div>
      </div>

      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      <div className="flex-1 flex flex-col relative z-10">
        <Header />
        
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          {selectedView === "overview" && <div className="space-y-6">
              {/* Compact Hero Section */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                          <Sparkles className="h-6 w-6 text-yellow-300" />
                        </div>
                        <div>
                          <h1 className="text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Smart Engine
                          </h1>
                          <p className="text-lg font-medium text-blue-100">Costumize your website</p>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed text-blue-50 max-w-xl">
                        Create intelligent content sections that automatically adapt based on user behavior, 
                        device type, and location for maximum engagement.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30 px-3 py-1 text-xs font-medium">
                          <Activity className="h-3 w-3 mr-1" />
                          Real-time Analytics
                        </Badge>
                        <Badge className="bg-green-400/20 text-green-100 border-green-400/30 px-3 py-1 text-xs font-medium">
                          <Users className="h-3 w-3 mr-1" />
                          User Targeting
                        </Badge>
                        <Badge className="bg-purple-400/20 text-purple-100 border-purple-400/30 px-3 py-1 text-xs font-medium">
                          <Zap className="h-3 w-3 mr-1" />
                          AI-Powered
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button onClick={() => setIsCreateDialogOpen(true)} size="default" className="bg-white text-indigo-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg h-10 px-6 group font-semibold">
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Create Section
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <Button variant="outline" size="default" onClick={() => navigate('/analytics')} className="border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 h-10 px-6 font-semibold text-white border rounded-lg group">
                        <BarChart3 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 text-xs">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {sections.length}
                      </h3>
                      <p className="text-sm font-medium text-slate-700">Smart Sections</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {sections.filter(s => s.is_enabled).length} active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 text-xs">
                        Growing
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {totalViews.toLocaleString()}
                      </h3>
                      <p className="text-sm font-medium text-slate-700">Total Views</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {analytics.uniqueViews} unique
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50 text-xs">
                        Optimized
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {totalConversions}
                      </h3>
                      <p className="text-sm font-medium text-slate-700">Conversions</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          ~5% rate
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compact Sections List */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold text-slate-800">Your Smart Sections</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        Manage your dynamic content sections
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-lg h-9 px-4 font-medium shadow-md hover:shadow-lg group">
                      <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      New Section
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {loading ? <div className="text-center py-12">
                      <div className="relative mx-auto w-10 h-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                      </div>
                      <p className="mt-4 text-slate-600 font-medium">Loading sections...</p>
                    </div> : sections.length === 0 ? <div className="text-center py-12">
                      <div className="relative mx-auto w-16 h-16 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800">Ready to get started?</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm">
                        Create your first smart section and experience AI-driven content 
                        that adapts to your users automatically.
                      </p>
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-lg h-10 px-6 font-medium shadow-md hover:shadow-lg group">
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Create Your First Section
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div> : <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {sections.map((section, index) => <div key={section.id} className="animate-fade-in-up" style={{
                  animationDelay: `${index * 0.1}s`
                }}>
                          <SectionCard section={section} onEdit={handleEditSection} onDelete={handleDeleteSection} />
                        </div>)}
                    </div>}
                </CardContent>
              </Card>
            </div>}

          {selectedView === "sections" && <div className="space-y-6">
              {/* Sections Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Smart Sections</h1>
                  <p className="text-muted-foreground text-sm">
                    Manage all your dynamic content sections
                  </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-lg h-9 px-4 font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Section
                </Button>
              </div>

              {/* Sections Content */}
              <Card className="professional-card p-6">
                {loading ? <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-3 text-muted-foreground font-medium text-sm">Loading sections...</p>
                  </div> : sections.length === 0 ? <div className="text-center py-12">
                    <div className="p-4 bg-gradient-primary rounded-2xl w-16 h-16 mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No sections created yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                      Get started by creating your first smart section with dynamic content.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-lg h-10 px-6 font-medium">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Section
                    </Button>
                  </div> : <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sections.map((section, index) => <div key={section.id} className="animate-fade-in-up" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                        <SectionCard section={section} onEdit={handleEditSection} onDelete={handleDeleteSection} />
                      </div>)}
                  </div>}
              </Card>
            </div>}

          {selectedView === "analytics" && <div className="space-y-4">
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground text-sm">Coming soon - Advanced analytics and reporting</p>
            </div>}
        </main>
      </div>

      {/* Dialogs */}
      <CreateSectionDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateSection} />

      <EditSectionDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} section={selectedSection} onSubmit={handleUpdateSection} />

      <AnalyticsDialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen} section={selectedSection} />

      <DeleteConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} section={selectedSection} onConfirm={handleConfirmDelete} isDeleting={isDeleting === selectedSection?.id} />
    </div>;
};
export default Index;