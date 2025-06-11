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
    <div className="min-h-screen flex w-full">
      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30">
        <Header />
        
        <main className="flex-1 p-6">
          {selectedView === "overview" && (
            <div className="space-y-8">
              {/* Modern Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        Smart Sections
                      </h1>
                      <p className="text-lg text-muted-foreground">
                        AI-powered dynamic content management
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl h-12 px-6 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create Section
                </Button>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Sections</CardTitle>
                    <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {sections.length}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-muted-foreground">
                        {sections.filter(s => s.is_enabled).length} active
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                    <div className="p-2 bg-gradient-secondary rounded-lg group-hover:scale-110 transition-transform">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                      {totalViews.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-muted-foreground">
                        {analytics.uniqueViews} unique visitors
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                    <div className="p-2 bg-gradient-accent rounded-lg group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                      {totalConversions}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-muted-foreground">
                        ~5% conversion rate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Sections List */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Your Sections</CardTitle>
                  <CardDescription className="text-base">
                    Manage and monitor your dynamic content sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">Loading sections...</p>
                    </div>
                  ) : sections.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-gradient-primary rounded-2xl w-16 h-16 mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No sections created yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first smart section to get started with dynamic content
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl h-12 px-6"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sections.map((section) => (
                        <SectionCard
                          key={section.id}
                          section={section}
                          onEdit={handleEditSection}
                          onDelete={handleDeleteSection}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedView === "sections" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Section Management</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Section
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onEdit={handleEditSection}
                    onDelete={handleDeleteSection}
                  />
                ))}
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

</edits_to_apply>
