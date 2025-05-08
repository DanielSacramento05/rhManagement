
import { Link, useLocation } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { Book } from "lucide-react";
import { getCurrentUser } from "@/services/authService";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const isHRManager = currentUser?.role === 'admin';
  const isTeamLeader = currentUser?.role === 'manager';
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define all possible nav items
  const allNavItems = [
    { path: "/", label: "Dashboard", showTo: ["admin", "manager", "employee"] },
    { path: "/employees", label: "Employees", showTo: ["admin", "manager"] },
    { path: "/absences", label: "Absences", showTo: ["admin", "manager", "employee"] },
    { path: "/performance", label: "Performance", showTo: ["admin", "manager"] },
    { path: "/tutorial", label: "Tutorial", icon: Book, showTo: ["admin", "manager", "employee"] },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    item.showTo.includes(currentUser?.role || 'employee')
  );

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
