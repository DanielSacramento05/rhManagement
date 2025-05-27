
import { Link, useLocation } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { Book } from "lucide-react";
import { getCurrentUser } from "@/services/authService";
import { hasPermission } from "@/services/permissionService";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const currentUser = getCurrentUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define all possible nav items with permission checks
  const allNavItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      show: true // Everyone can see dashboard
    },
    { 
      path: "/employees", 
      label: "Employees", 
      show: hasPermission('employees', 'read', 'department')
    },
    { 
      path: "/absences", 
      label: "Absences", 
      show: hasPermission('absences', 'read', 'own')
    },
    { 
      path: "/performance", 
      label: "Performance", 
      show: hasPermission('performance', 'read', 'own')
    },
    { 
      path: "/tutorial", 
      label: "Tutorial", 
      icon: Book, 
      show: true // Everyone can see tutorial
    },
  ];

  // Filter nav items based on permissions
  const navItems = allNavItems.filter(item => item.show);

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-primary mr-8">
              HR Management
            </Link>
            <div className="hidden md:flex items-center justify-center space-x-1 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
