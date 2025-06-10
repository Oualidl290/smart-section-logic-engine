
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { useSectionAnalytics } from "@/hooks/useSectionAnalytics";
import { SmartSection } from "@/types/section";

interface AnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: SmartSection | null;
}

export const AnalyticsDialog = ({ open, onOpenChange, section }: AnalyticsDialogProps) => {
  const { analytics, loading } = useSectionAnalytics(section?.id);

  if (!section) return null;

  const conversionRate = analytics.views > 0 ? ((analytics.views * 0.05) / analytics.views * 100).toFixed(1) : '0';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics for "{section.name}"
          </DialogTitle>
          <DialogDescription>
            Detailed analytics and performance metrics for this section
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading analytics...</div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.views}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.uniqueViews} unique visitors
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Estimated conversions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant={section.is_enabled ? "default" : "secondary"}>
                    {section.is_enabled ? "Active" : "Disabled"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated {new Date(section.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest views and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{activity.page_url || 'Unknown page'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.viewed_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">View</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No recent activity</p>
                )}
              </CardContent>
            </Card>

            {/* Section Details */}
            <Card>
              <CardHeader>
                <CardTitle>Section Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <strong>Content Preview:</strong>
                  <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                    {section.content.substring(0, 200)}
                    {section.content.length > 200 ? '...' : ''}
                  </p>
                </div>
                <div>
                  <strong>Conditions:</strong>
                  <p className="text-sm text-muted-foreground">
                    {section.conditions && typeof section.conditions === 'object' && Object.keys(section.conditions).length > 0
                      ? Object.entries(section.conditions as Record<string, any>).map(([key, value]) => 
                          `${key}: ${typeof value === 'object' ? value.value || JSON.stringify(value) : value}`
                        ).join(', ')
                      : 'No conditions set'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
