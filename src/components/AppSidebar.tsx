
import { Link, useLocation } from "react-router-dom";
import { 
  Book, 
  Home, 
  Users, 
  Calendar, 
  BarChart,
  UserCircle,
  Menu,
  Settings,
  Shield
} from "lucide-react";
import { getCurrentUser } from "@/services/authService";
import { hasPermission, isSystemAdmin } from "@/services/permissionService";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

export function AppSidebar() {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  
  // Define navigation items with permission-based visibility
  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: Home, 
      show: true // Everyone can see dashboard
    },
    { 
      path: "/employees", 
      label: "Employees", 
      icon: Users, 
      show: hasPermission('employees', 'read', 'department')
    },
    { 
      path: "/absences", 
      label: "Absences", 
      icon: Calendar, 
      show: hasPermission('absences', 'read', 'own')
    },
    { 
      path: "/performance", 
      label: "Performance", 
      icon: BarChart, 
      show: hasPermission('performance', 'read', 'own')
    },
    { 
      path: "/tutorial", 
      label: "Tutorial", 
      icon: Book, 
      show: true // Everyone can see tutorial
    },
    { 
      path: "/profile", 
      label: "My Profile", 
      icon: UserCircle, 
      show: true // Everyone can see their profile
    },
  ];

  // System admin specific items
  const systemAdminItems = [
    {
      path: "/system-config",
      label: "System Config",
      icon: Settings,
      show: isSystemAdmin()
    },
    {
      path: "/user-management",
      label: "User Management",
      icon: Shield,
      show: isSystemAdmin()
    }
  ];

  // Filter nav items based on permissions
  const filteredNavItems = navItems.filter(item => item.show);
  const filteredSystemItems = systemAdminItems.filter(item => item.show);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <div className="flex items-center justify-between h-20 px-6 py-2">
          <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-sidebar-primary">
            <div className="w-10 h-10 flex-shrink-0">
              <img 
                src="/assets/company-logo.png" 
                alt="HR Management" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='w-full h-full fill-current text-sidebar-primary'%3E%3Cpath d='M11.997 24a2.803 2.803 0 0 1-1.468-.4c-1.645-1-3.593-2.405-5.313-3.881C1.701 16.56 0 13.798 0 11.143V4.297a1.315 1.315 0 0 1 .695-1.174A21.754 21.754 0 0 1 11.997 0a21.758 21.758 0 0 1 11.303 3.123c.414.244.7.72.7 1.174v6.846c0 2.654-1.701 5.417-5.209 8.576-1.72 1.471-3.669 2.88-5.327 3.881a2.78 2.78 0 0 1-1.467.4zm-5.402-8.375v-.99h3.169v-1.16H6.595v-.99h3.169v-1.159H6.595v-.99h2.504v-.968l1.054-.977h-3.56v-.99h4.715l1.27 1.152 1.54-1.152h4.287v.99h-3.12l-1.1.835v.11h2.405v.99H14.56v1.162h2.626v.99H14.56v1.16h2.626v.99H9.809v-.99h3.169v-1.16H9.809v-.99h3.169v-1.16H9.809v-.99h2.132l-.99-.842-1.32.842H6.595z'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <span className="hidden sm:inline">HR Management</span>
          </Link>
          
          {/* Mobile Toggle Button Inside Header */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="sm:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                    size="lg"
                    onClick={() => isMobile && toggleSidebar()}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {filteredSystemItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>System Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSystemItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive(item.path)}
                      tooltip={item.label}
                      size="lg"
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-base">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            &copy; {new Date().getFullYear()} HR Management
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
