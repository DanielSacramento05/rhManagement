
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Users, 
  Calendar, 
  LineChart, 
  Home,
  Bell
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Employees', path: '/employees', icon: <Users className="w-5 h-5" /> },
    { name: 'Absences', path: '/absences', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Performance', path: '/performance', icon: <LineChart className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-semibold text-xl tracking-tight">RH Manager</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <Avatar className="h-8 w-8">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" alt="Avatar" />
            </Avatar>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${
          isOpen ? 'block animate-fade-in' : 'hidden'
        } md:hidden`}
      >
        <div className="glass-panel m-2 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-2 px-4 py-3 text-base font-medium ${
                isActive(link.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <Separator className="my-2" />
          <div className="px-4 py-2">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-medium">admin@rhmanager.com</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
