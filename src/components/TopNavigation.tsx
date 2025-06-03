
import { useLocation } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart,
  Book,
  UserCircle,
  Settings,
  Shield
} from "lucide-react";

export function TopNavigation() {
  const location = useLocation();
  
  // Map routes to page names and icons
  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: 'Dashboard', icon: Home };
      case '/employees':
        return { title: 'Employees', icon: Users };
      case '/absences':
        return { title: 'Absences', icon: Calendar };
      case '/performance':
        return { title: 'Performance', icon: BarChart };
      case '/tutorial':
        return { title: 'Tutorial', icon: Book };
      case '/profile':
        return { title: 'My Profile', icon: UserCircle };
      case '/profile-setup':
        return { title: 'Profile Setup', icon: UserCircle };
      case '/system-config':
        return { title: 'System Configuration', icon: Settings };
      case '/user-management':
        return { title: 'User Management', icon: Shield };
      default:
        return { title: 'Dashboard', icon: Home };
    }
  };

  const pageInfo = getPageInfo(location.pathname);
  const IconComponent = pageInfo.icon;

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-16 bg-background border-b border-border flex items-center justify-between px-4 z-40 shadow-sm md:pl-[calc(16rem+1rem)]">
      <div className="flex items-center gap-3">
        <IconComponent className="h-6 w-6 text-foreground dark:text-white" />
        <h1 className="text-xl font-semibold text-foreground">
          {pageInfo.title}
        </h1>
      </div>
      <ProfileMenu />
    </div>
  );
}
