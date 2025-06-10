
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Zap, BarChart3, Eye } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CreateSectionDialog } from "@/components/sections/CreateSectionDialog";
import { SectionCard } from "@/components/sections/SectionCard";
import { useSmartSections } from "@/hooks/useSmartSections";
import { useSectionAnalytics } from "@/hooks/useSectionAnalytics";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { sections, loading, createSection, updateSection, deleteSection } = useSmartSections();
  const { analytics } = useSectionAnalytics();

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

  const handleEditSection = (sectionId: string) => {
    console.log("Editing section:", sectionId);
    navigate(`/sections/${sectionId}/edit`);
  };

  const handleDeleteSection = async (sectionId: string) => {
    await deleteSection(sectionId);
  };

  const handleViewAnalytics = (sectionId: string) => {
    console.log("Viewing analytics for:", sectionId);
    navigate(`/analytics/${sectionId}`);
  };

  const handleToggleSection = async (sectionId: string, currentStatus: boolean) => {
    await updateSection(sectionId, { is_enabled: !currentStatus });
  };

  // Convert backend sections to frontend format
  const formattedSections = sections.map(section => ({
    id: section.id,
    name: section.name,
    status: section.is_enabled ? "active" as const : "draft" as const,
    views: 0, // Will be populated from analytics
    conversions: 0, // Will be calculated from analytics
    conditions: typeof section.conditions === 'object' && section.conditions !== null 
      ? Object.entries(section.conditions as Record<string, any>).map(([key, value]: [string, any]) => 
          `${key}: ${value.value || value}`
        )
      : [],
    lastModified: new Date(section.updated_at).toLocaleDateString()
  }));

  const totalViews = analytics.views;
  const totalConversions = Math.floor(analytics.views * 0.05); // Approximate conversion rate

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          {selectedView === "overview" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Smart Sections</h1>
                  <p className="text-muted-foreground">
                    Manage your dynamic WordPress content sections
                  </p>
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Section
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sections.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {sections.filter(s => s.is_enabled).length} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalViews.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.uniqueViews} unique visitors
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalConversions}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ~5% conversion rate
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sections List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Sections</CardTitle>
                  <CardDescription>
                    Manage and monitor your dynamic content sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading sections...</div>
                  ) : formattedSections.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No sections created yet</p>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {formattedSections.map((section) => (
                        <SectionCard
                          key={section.id}
                          section={section}
                          onEdit={handleEditSection}
                          onDelete={handleDeleteSection}
                          onViewAnalytics={handleViewAnalytics}
                          onToggle={handleToggleSection}
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
                {formattedSections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onEdit={handleEditSection}
                    onDelete={handleDeleteSection}
                    onViewAnalytics={handleViewAnalytics}
                    onToggle={handleToggleSection}
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

      <CreateSectionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSection}
      />
    </div>
  );
};

export default Index;
