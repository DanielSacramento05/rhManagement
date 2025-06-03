
import { useLocation } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";

export function TopNavigation() {
  const location = useLocation();
  
  // Map routes to page names
  const getPageName = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/employees':
        return 'Employees';
      case '/absences':
        return 'Absences';
      case '/performance':
        return 'Performance';
      case '/tutorial':
        return 'Tutorial';
      case '/profile':
        return 'My Profile';
      case '/profile-setup':
        return 'Profile Setup';
      case '/system-config':
        return 'System Configuration';
      case '/user-management':
        return 'User Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-16 bg-background border-b border-border flex items-center justify-between px-4 z-40 shadow-sm">
      <h1 className="text-xl font-semibold text-foreground">
        {getPageName(location.pathname)}
      </h1>
      <ProfileMenu />
    </div>
  );
}
