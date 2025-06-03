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
import { ThemeLogo } from "./ThemeLogo";

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
    <div className="z-50">
      <Sidebar>
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center justify-between h-20 px-6 py-2">
            <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-sidebar-primary">
              <div className="w-10 h-10 flex-shrink-0">
                <ThemeLogo className="w-full h-full object-contain" alt="HR Management" />
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
    </div>
  );
}
