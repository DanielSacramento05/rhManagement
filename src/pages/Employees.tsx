
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeCard } from "@/components/EmployeeCard";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmployees } from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { Employee, Department, EmployeeFilters } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Employees = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Build filter parameters for API
  const buildFilters = (): EmployeeFilters => {
    return {
      page: currentPage,
      pageSize,
      department: selectedDepartment || undefined,
      status: selectedStatus || undefined,
      search: searchTerm || undefined
    };
  };

  // Fetch employees with react-query
  const {
    data: employeesData,
    isLoading: employeesLoading,
    error: employeesError,
    refetch: refetchEmployees
  } = useQuery({
    queryKey: ['employees', buildFilters()],
    queryFn: () => getEmployees(buildFilters()),
    // Disable automatic refetching when filters haven't changed
    staleTime: 60000,
  });

  // Fetch departments with react-query
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
    staleTime: 300000, // Departments don't change often
  });

  useEffect(() => {
    if (employeesError) {
      toast({
        title: "Error loading employees",
        description: "Could not load employee data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [employeesError, toast]);

  const addFilter = (type: string, value: string) => {
    const filter = `${type}: ${value}`;
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    
    // Reset the corresponding state
    if (filter.startsWith("Department")) {
      setSelectedDepartment(null);
    } else if (filter.startsWith("Status")) {
      setSelectedStatus(null);
    }
  };

  const resetFilters = () => {
    setActiveFilters([]);
    setSelectedDepartment(null);
    setSelectedStatus(null);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    addFilter("Department", value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    addFilter("Status", value);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Get filtered employees based on the current tab
  const getFilteredEmployees = (status?: string): Employee[] => {
    if (!employeesData?.data) return [];
    
    if (status) {
      return employeesData.data.filter(emp => emp.status === status);
    }
    
    return employeesData.data;
  };

  return (
    <div className="page-container pb-16">
      <div className="animate-in">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Employees</h1>
        <p className="text-muted-foreground mb-8">Manage your organization's team members.</p>
      </div>
      
      <div className="mb-8 animate-in">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Employees</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="remote">Remote</TabsTrigger>
              <TabsTrigger value="on-leave">On Leave</TabsTrigger>
            </TabsList>
            
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search employees..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select onValueChange={handleDepartmentChange} value={selectedDepartment || ""}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {departmentsLoading ? (
                  <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                ) : (
                  departmentsData?.data.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Select onValueChange={handleStatusChange} value={selectedStatus || ""}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">In Office</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <button 
                    className="ml-1 rounded-full hover:bg-muted" 
                    onClick={() => removeFilter(filter)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear all
              </Button>
            </div>
          )}
          
          {employeesLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading employees...</p>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredEmployees().map((employee) => (
                    <EmployeeCard 
                      key={employee.id}
                      id={employee.id}
                      name={employee.name}
                      position={employee.position}
                      department={employee.department}
                      email={employee.email}
                      phone={employee.phone}
                      status={employee.status}
                      imageUrl={employee.imageUrl}
                    />
                  ))}
                </div>
                
                {getFilteredEmployees().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No employees found matching your criteria.</p>
                    <Button variant="outline" className="mt-4" onClick={resetFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredEmployees('active').map((employee) => (
                    <EmployeeCard 
                      key={employee.id}
                      id={employee.id}
                      name={employee.name}
                      position={employee.position}
                      department={employee.department}
                      email={employee.email}
                      phone={employee.phone}
                      status={employee.status}
                      imageUrl={employee.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="remote" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredEmployees('remote').map((employee) => (
                    <EmployeeCard 
                      key={employee.id}
                      id={employee.id}
                      name={employee.name}
                      position={employee.position}
                      department={employee.department}
                      email={employee.email}
                      phone={employee.phone}
                      status={employee.status}
                      imageUrl={employee.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="on-leave" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredEmployees('on-leave').map((employee) => (
                    <EmployeeCard 
                      key={employee.id}
                      id={employee.id}
                      name={employee.name}
                      position={employee.position}
                      department={employee.department}
                      email={employee.email}
                      phone={employee.phone}
                      status={employee.status}
                      imageUrl={employee.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Employees;
