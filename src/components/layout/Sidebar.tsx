
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  User,
  Zap
} from "lucide-react";

interface SidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const sidebarItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export const Sidebar = ({ selectedView, onViewChange }: SidebarProps) => {
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Smart Sections</h2>
            <p className="text-xs text-sidebar-foreground/60">Free Plan</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={selectedView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  selectedView === item.id 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-gradient-primary/10 p-4 text-center">
          <h3 className="font-semibold text-sm text-sidebar-foreground mb-2">
            Enjoying Smart Sections?
          </h3>
          <p className="text-xs text-sidebar-foreground/70 mb-3">
            All features are free to use. Create unlimited smart sections!
          </p>
        </div>
      </div>
    </div>
  );
};
