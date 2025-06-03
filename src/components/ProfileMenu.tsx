
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { getCurrentUser, logout } from "@/services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployeeById } from "@/services/employeeService";
import { useTheme } from "./ThemeProvider";
import { getRoleDisplayName } from "@/services/permissionService";

export function ProfileMenu() {
  const [user, setUser] = useState(() => getCurrentUser() || { 
    id: '',
    email: 'user@example.com', 
    role: 'employee', 
    name: 'User' 
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  
  // Fetch employee data to get profile picture if available
  const { data: employeeData, isLoading } = useQuery({
    queryKey: ['employee', user.id],
    queryFn: () => getEmployeeById(user.id),
    enabled: !!user.id,
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Profile picture from employee data
  const profilePicture = employeeData?.data?.imageUrl || employeeData?.data?.image_url;
  
  // Listen for changes to user data in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      console.log('ProfileMenu: Storage changed, new user:', updatedUser);
      setUser(updatedUser || { 
        id: '',
        email: 'user@example.com', 
        role: 'employee', 
        name: 'User' 
      });
    };
    
    // Only listen to storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh employee data every 5 minutes to ensure status is current
    const refreshInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, [queryClient]);
  
  // Force refresh employee data on component mount
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  }, [queryClient]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    // Force page reload to update authentication state everywhere
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 px-3">
          <div className="text-right mr-2">
            <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">{getRoleDisplayName(user.role)}</p>
          </div>
          <Avatar className="h-10 w-10">
            {profilePicture ? (
              <AvatarImage 
                src={profilePicture} 
                alt={user.name || 'User profile'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";
                }}
              />
            ) : (
              <AvatarFallback>
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50 bg-background border shadow-lg" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
