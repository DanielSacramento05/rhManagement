
import { Link, useLocation } from "react-router-dom";
import { Book, Home, Users, Calendar, BarChart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";
import { getCurrentUser } from "@/services/authService";
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
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const isHRManager = currentUser?.role === 'admin';
  const isTeamLeader = currentUser?.role === 'manager';
  
  // Define all possible nav items
  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: Home, 
      showTo: ["admin", "manager", "employee"] 
    },
    { 
      path: "/employees", 
      label: "Employees", 
      icon: Users, 
      showTo: ["admin", "manager"] 
    },
    { 
      path: "/absences", 
      label: "Absences", 
      icon: Calendar, 
      showTo: ["admin", "manager", "employee"] 
    },
    { 
      path: "/performance", 
      label: "Performance", 
      icon: BarChart, 
      showTo: ["admin", "manager"] 
    },
    { 
      path: "/tutorial", 
      label: "Tutorial", 
      icon: Book, 
      showTo: ["admin", "manager", "employee"] 
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.showTo.includes(currentUser?.role || 'employee')
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <div className="flex items-center h-16 px-4">
          <Link to="/" className="text-xl font-semibold text-sidebar-primary">
            HR Management
          </Link>
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
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
