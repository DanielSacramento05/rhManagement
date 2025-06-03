
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { AddEmployeeForm } from "@/components/employees/AddEmployeeForm";
import { EmployeeCard } from "@/components/EmployeeCard";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { getCurrentUser } from "@/services/authService";
import { hasPermission } from "@/services/permissionService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Employees = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const isMobile = useIsMobile();
  
  const currentUser = getCurrentUser();
  const canCreateEmployees = hasPermission('employees', 'create', 'department');

  // Fetch employees
  const { data: employeesData, isLoading, error } = useQuery({
    queryKey: ['employees', currentPage, pageSize, searchTerm, selectedDepartment],
    queryFn: () => getEmployees({
      page: currentPage,
      pageSize: pageSize,
      search: searchTerm,
      department: selectedDepartment === "all" ? undefined : selectedDepartment,
    })
  });

  // Fetch departments
  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments
  });

  const employees = employeesData?.data || [];
  const totalEmployees = employeesData?.totalCount || 0;
  const departments = departmentsData?.data || [];

  const totalPages = Math.ceil(totalEmployees / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="page-container pb-16">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canCreateEmployees && (
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Employee grid */}
      {isLoading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} {...employee} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="mr-2"
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Add employee form modal */}
      <AddEmployeeForm open={showAddForm} onOpenChange={setShowAddForm} />
    </div>
  );
};

export default Employees;
