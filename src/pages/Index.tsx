
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Zap, BarChart3, Eye, Sparkles, TrendingUp } from "lucide-react";
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
    const { name, description, content, conditions } = sectionData;
    
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
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {selectedView === "overview" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white">
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                            Real Results
                          </h1>
                          <p className="text-xl text-white/90 font-medium">
                            AI-powered dynamic content that adapts to your users
                          </p>
                        </div>
                      </div>
                      <p className="text-lg text-white/80 leading-relaxed">
                        Create intelligent content sections that automatically adjust based on user behavior, 
                        device type, location, and more. Boost engagement with personalized experiences.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl h-12 px-8 group font-semibold"
                      >
                        <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Create Section
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="border-white/30 text-white hover:bg-white/10 h-12 px-8 font-semibold"
                        onClick={() => navigate('/analytics')}
                      >
                        <BarChart3 className="h-5 w-5 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="professional-card p-6 group hover:scale-105 transition-all duration-300 animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/30">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {sections.length}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">Total Sections</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        {sections.filter(s => s.is_enabled).length} active sections
                      </span>
                    </div>
                  </div>
                </div>

                <div className="professional-card p-6 group hover:scale-105 transition-all duration-300 animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-secondary rounded-xl group-hover:scale-110 transition-transform">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-secondary border-secondary/30">
                      Growing
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                      {totalViews.toLocaleString()}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        {analytics.uniqueViews} unique visitors
                      </span>
                    </div>
                  </div>
                </div>

                <div className="professional-card p-6 group hover:scale-105 transition-all duration-300 animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-accent rounded-xl group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-accent border-accent/30">
                      Optimized
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                      {totalConversions}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        ~5% conversion rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Sections List */}
              <div className="professional-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your Smart Sections</h2>
                    <p className="text-muted-foreground">
                      Manage and monitor your dynamic content sections with real-time analytics
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl h-11 px-6 font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Section
                  </Button>
                </div>

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
                      <div 
                        key={section.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
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
