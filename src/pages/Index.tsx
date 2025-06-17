
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Zap, BarChart3, Eye, TrendingUp, ArrowRight, Users, Activity } from "lucide-react";
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

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleCreateSection = async (sectionData: {
    name: string;
    content: string;
    conditions: Record<string, any>;
  }) => {
    await createSection(sectionData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSection = async (sectionId: string, updates: Partial<SmartSection>) => {
    await updateSection(sectionId, updates);
    setIsEditDialogOpen(false);
  };

  const handleEditSection = (section: SmartSection) => {
    setSelectedSection(section);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSection = (section: SmartSection) => {
    setSelectedSection(section);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSection) {
      await confirmDelete(selectedSection.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleViewAnalytics = (section: SmartSection) => {
    setSelectedSection(section);
    setIsAnalyticsDialogOpen(true);
  };

  const handleToggleSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      toggleSection(sectionId, section.is_enabled);
    }
  };

  const handleDuplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      duplicateSection(section);
    }
  };

  const totalViews = analytics.views;
  const totalConversions = Math.floor(analytics.views * 0.05);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-3 max-w-5xl mx-auto w-full">
          {selectedView === "overview" && (
            <div className="space-y-3 animate-fade-in">
              {/* Hero Section */}
              <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white shadow-md">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-white/20 backdrop-blur-sm">
                        <Zap className="h-4 w-4 text-yellow-300" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold">
                          Smart Engine
                        </h1>
                        <p className="text-sm text-blue-100">
                          Dynamic Content Management
                        </p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-blue-50 max-w-xl">
                      Create intelligent content sections that automatically adapt based on user behavior, 
                      device type, location, and conditions for enhanced user engagement.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30 text-xs px-1.5 py-0.5">
                        <Activity className="h-2.5 w-2.5 mr-1" />
                        Real-time
                      </Badge>
                      <Badge className="bg-green-400/20 text-green-100 border-green-400/30 text-xs px-1.5 py-0.5">
                        <Users className="h-2.5 w-2.5 mr-1" />
                        Targeted
                      </Badge>
                      <Badge className="bg-purple-400/20 text-purple-100 border-purple-400/30 text-xs px-1.5 py-0.5">
                        <Zap className="h-2.5 w-2.5 mr-1" />
                        Dynamic
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)} 
                      size="sm" 
                      className="bg-white text-blue-600 hover:bg-blue-50 rounded-md h-7 px-3 group font-medium text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform duration-200" />
                      Create Section
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/analytics')} 
                      className="border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 h-7 px-3 font-medium text-white border rounded-md group text-xs"
                    >
                      <BarChart3 className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform duration-200" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 rounded-md">
                  <CardHeader className="pb-1.5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md">
                        <Zap className="h-3.5 w-3.5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 text-xs px-1.5 py-0.5">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold text-blue-600">
                        {sections.length}
                      </h3>
                      <p className="text-xs font-medium text-slate-700">Smart Sections</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {sections.filter(s => s.is_enabled).length} running
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-all duration-300 rounded-md">
                  <CardHeader className="pb-1.5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md">
                        <Eye className="h-3.5 w-3.5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 text-xs px-1.5 py-0.5">
                        Growing
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold text-emerald-600">
                        {totalViews.toLocaleString()}
                      </h3>
                      <p className="text-xs font-medium text-slate-700">Total Views</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {analytics.uniqueViews} unique
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300 rounded-md">
                  <CardHeader className="pb-1.5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md">
                        <BarChart3 className="h-3.5 w-3.5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50 text-xs px-1.5 py-0.5">
                        Optimized
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold text-purple-600">
                        {totalConversions}
                      </h3>
                      <p className="text-xs font-medium text-slate-700">Conversions</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          ~5% rate
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sections List */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-lg">
                <CardHeader className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-base font-bold text-slate-800">Your Smart Sections</CardTitle>
                      <CardDescription className="text-xs text-slate-600">
                        Manage and monitor your dynamic content sections
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md h-7 px-2.5 font-medium shadow-md hover:shadow-lg group text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform duration-200" />
                      New Section
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-3">
                  {loading ? (
                    <div className="text-center py-6">
                      <div className="relative mx-auto w-5 h-5">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                      </div>
                      <p className="mt-2 text-slate-600 font-medium text-xs">Loading sections...</p>
                    </div>
                  ) : sections.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="relative mx-auto w-10 h-10 mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                          <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold mb-1 text-slate-800">Ready to get started?</h3>
                      <p className="text-slate-600 mb-3 max-w-md mx-auto text-xs">
                        Create your first smart section and experience dynamic content 
                        that adapts to your users.
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md h-7 px-3 font-medium shadow-md hover:shadow-lg group text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform duration-200" />
                        Create Your First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-2.5">
                      {sections.map((section) => (
                        <SectionCard
                          key={section.id}
                          section={section}
                          onEdit={handleEditSection}
                          onDelete={handleDeleteSection}
                          onToggle={handleToggleSection}
                          onAnalytics={handleViewAnalytics}
                          onDuplicate={handleDuplicateSection}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedView === "sections" && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-slate-800">All Sections</h1>
                  <p className="text-xs text-slate-600 mt-0.5">Manage your content sections</p>
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md h-7 px-2.5 font-medium shadow-md hover:shadow-lg group text-xs"
                >
                  <Plus className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform duration-200" />
                  Create Section
                </Button>
              </div>

              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-lg">
                <CardContent className="p-3">
                  {loading ? (
                    <div className="text-center py-6">
                      <div className="relative mx-auto w-5 h-5">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                      </div>
                      <p className="mt-2 text-slate-600 font-medium text-xs">Loading sections...</p>
                    </div>
                  ) : (
                    <div className="grid gap-2.5">
                      {sections.map((section) => (
                        <SectionCard
                          key={section.id}
                          section={section}
                          onEdit={handleEditSection}
                          onDelete={handleDeleteSection}
                          onToggle={handleToggleSection}
                          onAnalytics={handleViewAnalytics}
                          onDuplicate={handleDuplicateSection}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
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
        isDeleting={!!isDeleting}
      />
    </div>
  );
};

export default Index;
