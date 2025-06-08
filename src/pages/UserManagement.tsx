
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone,
  Calendar,
  MoreHorizontal,
  User,
  UserX,
  UserCheck,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees, formatRoleForDisplay, updateEmployee, updateEmployeeRole } from "@/services/employeeService";
import { updateUserRole } from "@/services/authService";
import { format, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Employee } from "@/types";

type RoleType = 'hr_admin' | 'dept_manager' | 'employee' | 'system_admin';

const UserManagement = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [showManagerDialog, setShowManagerDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data: employeesData, isLoading, refetch } = useQuery({
    queryKey: ['employees', searchTerm, roleFilter, statusFilter],
    queryFn: () => getEmployees({ 
      search: searchTerm || undefined,
      pageSize: 100 // Get more users for management view
    }),
  });

  const employees = employeesData?.data || [];

  const filteredEmployees = employees.filter(employee => {
    if (roleFilter !== "all" && employee.role !== roleFilter) {
      return false;
    }
    if (statusFilter !== "all" && employee.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Get potential managers (excluding the selected employee)
  const potentialManagers = employees.filter(emp => 
    (emp.role === 'hr_admin' || emp.role === 'dept_manager' || emp.role === 'system_admin') &&
    emp.id !== selectedEmployee?.id
  );

  // Role update mutation
  const roleUpdateMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: RoleType }) => 
      updateEmployeeRole(userId, role),
    onSuccess: (updatedUser) => {
      toast({
        title: "Role updated",
        description: `User role has been updated to ${formatRoleForDisplay(updatedUser.data.role || 'employee')}.`,
      });
      // Invalidate and refetch the employees data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      refetch();
    },
    onError: (error) => {
      console.error('Role update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role.",
        variant: "destructive",
      });
    }
  });

  // Status update mutation
  const statusUpdateMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'on-leave' | 'remote' | 'inactive' | 'out-of-office' }) => 
      updateEmployee(userId, { status }),
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "User status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      refetch();
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user status.",
        variant: "destructive",
      });
    }
  });

  // Manager update mutation
  const managerUpdateMutation = useMutation({
    mutationFn: ({ userId, managerId }: { userId: string; managerId: string | null }) => 
      updateEmployee(userId, { managerId }),
    onSuccess: () => {
      toast({
        title: "Manager updated",
        description: "Employee manager has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowManagerDialog(false);
      setSelectedEmployee(null);
      refetch();
    },
    onError: (error) => {
      console.error('Manager update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update employee manager.",
        variant: "destructive",
      });
    }
  });

  const handleRoleChange = async (userId: string, newRole: RoleType) => {
    console.log('Updating role for user:', userId, 'to:', newRole);
    roleUpdateMutation.mutate({ userId, role: newRole });
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'on-leave' | 'remote' | 'inactive' | 'out-of-office') => {
    statusUpdateMutation.mutate({ userId, status: newStatus });
  };

  const handleManagerChange = (managerId: string | null) => {
    if (selectedEmployee) {
      managerUpdateMutation.mutate({ userId: selectedEmployee.id, managerId });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'system_admin':
        return 'destructive';
      case 'hr_admin':
        return 'default';
      case 'dept_manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'on-leave':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="page-container pb-16">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="dept_manager">Department Manager</SelectItem>
            <SelectItem value="hr_admin">HR Admin</SelectItem>
            <SelectItem value="system_admin">System Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full lg:w-auto">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            {/* Add user form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => {
                const manager = employees.find(emp => emp.id === employee.managerId);
                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.imageUrl} />
                          <AvatarFallback>
                            {employee.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(employee.role || 'employee')}>
                        {formatRoleForDisplay(employee.role || 'employee')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.department}</p>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {manager ? (
                        <div>
                          <p className="font-medium">{manager.name}</p>
                          <p className="text-sm text-muted-foreground">{formatRoleForDisplay(manager.role || 'employee')}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No Manager</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(employee.status)}>
                        {employee.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={roleUpdateMutation.isPending || statusUpdateMutation.isPending || managerUpdateMutation.isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowManagerDialog(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Set Manager
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(employee.id, 'employee')}
                            disabled={employee.role === 'employee' || roleUpdateMutation.isPending}
                          >
                            Set as Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(employee.id, 'dept_manager')}
                            disabled={employee.role === 'dept_manager' || roleUpdateMutation.isPending}
                          >
                            Set as Dept Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(employee.id, 'hr_admin')}
                            disabled={employee.role === 'hr_admin' || roleUpdateMutation.isPending}
                          >
                            Set as HR Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(employee.id, 'system_admin')}
                            disabled={employee.role === 'system_admin' || roleUpdateMutation.isPending}
                          >
                            Set as System Admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {employee.status === 'inactive' ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(employee.id, 'active')}
                              disabled={statusUpdateMutation.isPending}
                              className="text-green-600"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Reactivate User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(employee.id, 'inactive')}
                              disabled={statusUpdateMutation.isPending}
                              className="text-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Manager Assignment Dialog */}
      <Dialog open={showManagerDialog} onOpenChange={setShowManagerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Manager</DialogTitle>
            <DialogDescription>
              Select a manager for {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select 
              defaultValue={selectedEmployee?.managerId || "no-manager"}
              onValueChange={(value) => handleManagerChange(value === "no-manager" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-manager">No Manager</SelectItem>
                {potentialManagers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name} - {formatRoleForDisplay(manager.role || 'employee')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.role === 'system_admin' || e.role === 'hr_admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.role === 'dept_manager').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
