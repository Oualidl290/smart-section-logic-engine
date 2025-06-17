
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Layers, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { 
    id: "overview", 
    label: "Dashboard", 
    icon: Home, 
    route: "/", 
    viewId: "overview"
  },
  { 
    id: "sections", 
    label: "Sections", 
    icon: Layers, 
    route: "/", 
    viewId: "sections"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    icon: BarChart3, 
    route: "/analytics", 
    viewId: "analytics"
  },
  { 
    id: "profile", 
    label: "Profile", 
    icon: User, 
    route: "/profile", 
    viewId: "profile"
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: Settings, 
    route: "/settings", 
    viewId: "settings"
  },
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
      "bg-white border-r border-border/50 transition-all duration-300 flex flex-col shadow-sm",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  Smart Engine
                </span>
                <p className="text-xs text-muted-foreground font-medium">
                  Content Management
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 hover:bg-primary/10"
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
      <nav className="flex-1 p-4 space-y-2">
        {!isCollapsed && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Navigation
            </p>
          </div>
        )}
        
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = getSelectedItemId() === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 font-medium transition-all duration-200",
                    isSelected 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                      : "hover:bg-primary/5 text-muted-foreground hover:text-foreground",
                    isCollapsed && "px-3"
                  )}
                  onClick={() => handleMenuClick(item)}
                >
                  <Icon className={cn(
                    "h-5 w-5", 
                    !isCollapsed && "mr-3",
                    isSelected && "text-primary"
                  )} />
                  {!isCollapsed && (
                    <span>{item.label}</span>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                v2.0.0 - Smart Sections
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
