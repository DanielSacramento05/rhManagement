
import { Link, useLocation } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/employees", label: "Employees" },
    { path: "/absences", label: "Absences" },
    { path: "/performance", label: "Performance" },
  ];

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
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
