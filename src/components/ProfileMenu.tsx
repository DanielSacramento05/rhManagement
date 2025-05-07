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
import { LogOut, User } from "lucide-react";
import { getCurrentUser, logout } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "@/services/employeeService";

export function ProfileMenu() {
  const [user, setUser] = useState(() => getCurrentUser() || { 
    id: '',
    email: 'user@example.com', 
    role: 'employee', 
    name: 'User' 
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      setUser(getCurrentUser() || { 
        id: '',
        email: 'user@example.com', 
        role: 'employee', 
        name: 'User' 
      });
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    // Force page reload to update authentication state everywhere
    window.location.href = '/login';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
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
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
