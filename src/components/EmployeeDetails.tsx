
import { useState } from "react";
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Calendar, Award, Building, User, Edit, Trash2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { updateEmployee, deleteEmployee } from '@/services/employeeService';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';

interface EmployeeDetailsProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetails({ employee, isOpen, onClose }: EmployeeDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Status badge style
  const getStatusBadge = () => {
    switch (employee.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Office</Badge>;
      case 'on-leave':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">On Leave</Badge>;
      case 'remote':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Remote</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>;
      case 'out-of-office':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Out of Office</Badge>;
      default:
        return null;
    }
  };

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Employee>) => updateEmployee(employee.id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update employee status",
      });
    }
  });

  // Soft delete (deactivate) employee mutation
  const deleteMutation = useMutation({
    mutationFn: () => updateEmployee(employee.id, { status: 'inactive' }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee deactivated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDeleting(false);
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deactivate employee",
      });
    }
  });

  // Hard delete employee mutation (for actual deletion if required)
  const hardDeleteMutation = useMutation({
    mutationFn: () => deleteEmployee(employee.id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDeleting(false);
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete employee",
      });
    }
  });

  const handleStatusChange = (newStatus: 'active' | 'on-leave' | 'remote' | 'inactive') => {
    updateMutation.mutate({ status: newStatus });
  };

  const handleDeactivate = () => {
    deleteMutation.mutate();
  };

  const handleActivate = () => {
    updateMutation.mutate({ status: 'active' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>View detailed information about this employee</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-24 w-24 mb-2">
            <img src={employee.imageUrl} alt={employee.name} className="object-cover" />
          </Avatar>
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <p className="text-muted-foreground">{employee.position}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{employee.department}</Badge>
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{employee.phone}</span>
          </div>
          {employee.hireDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
            </div>
          )}
          {employee.managerId && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Manager ID: {employee.managerId}</span>
            </div>
          )}
        </div>
        
        {isAdmin && (
          <div className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2">
              <h3 className="text-sm font-medium w-full">Update Status:</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('active')}
                className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
              >
                In Office
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('remote')}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
              >
                Remote
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('on-leave')}
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
              >
                On Leave
              </Button>
            </div>
            
            <div className="flex justify-between">
              {employee.status === 'inactive' ? (
                <Button 
                  onClick={handleActivate}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <User className="mr-2 h-4 w-4" />
                  Reactivate Employee
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleting(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deactivate Employee
                </Button>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>

      {/* Confirmation dialog for deactivating employee */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deactivate Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this employee? They will be marked as inactive but their data will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
