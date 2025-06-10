
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Layers, 
  BarChart3, 
  Settings, 
  Zap,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: Home, route: "/", viewId: "overview" },
  { id: "sections", label: "Sections", icon: Layers, route: "/", viewId: "sections" },
  { id: "analytics", label: "Analytics", icon: BarChart3, route: "/analytics", viewId: "analytics" },
  { id: "profile", label: "Profile", icon: User, route: "/profile", viewId: "profile" },
  { id: "settings", label: "Settings", icon: Settings, route: "/settings", viewId: "settings" },
];

export const Sidebar = ({ selectedView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.route === "/") {
      onViewChange(item.viewId);
      if (location.pathname !== "/") {
        navigate("/");
      }
    } else {
      navigate(item.route);
    }
  };

  const getSelectedItemId = () => {
    if (location.pathname === "/analytics") return "analytics";
    if (location.pathname === "/profile") return "profile";
    if (location.pathname === "/settings") return "settings";
    return selectedView;
  };

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-sidebar-primary" />
                <span className="font-semibold text-sidebar-foreground">Smart Sections</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = getSelectedItemId() === item.id;
              
              return (
                <li key={item.id}>
                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                      isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
                      isCollapsed && "px-2"
                    )}
                    onClick={() => handleMenuClick(item)}
                  >
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/60">
              v1.0.0 - Smart Sections
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
