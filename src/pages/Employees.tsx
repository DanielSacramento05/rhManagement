
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeCard } from "@/components/EmployeeCard";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for employees
const employeesData = [
  {
    id: "1",
    name: "Emily Johnson",
    position: "Senior UX Designer",
    department: "Design",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    position: "Software Engineer",
    department: "Engineering",
    email: "michael.rodriguez@example.com",
    phone: "+1 (555) 987-6543",
    status: "remote",
    imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "3",
    name: "Jessica Chen",
    position: "Product Manager",
    department: "Product",
    email: "jessica.chen@example.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "4",
    name: "David Wilson",
    position: "Marketing Director",
    department: "Marketing",
    email: "david.wilson@example.com",
    phone: "+1 (555) 876-5432",
    status: "on-leave",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "5",
    name: "Sophia Martinez",
    position: "HR Specialist",
    department: "Human Resources",
    email: "sophia.martinez@example.com",
    phone: "+1 (555) 345-6789",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "6",
    name: "Andrew Taylor",
    position: "Financial Analyst",
    department: "Finance",
    email: "andrew.taylor@example.com",
    phone: "+1 (555) 432-1098",
    status: "remote",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    addFilter("Department", value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    addFilter("Status", value);
  };

  // Filter employees based on search and filters
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
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
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard 
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  position={employee.position}
                  department={employee.department}
                  email={employee.email}
                  phone={employee.phone}
                  status={employee.status as 'active' | 'on-leave' | 'remote'}
                  imageUrl={employee.imageUrl}
                />
              ))}
            </div>
            
            {filteredEmployees.length === 0 && (
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
              {filteredEmployees
                .filter(emp => emp.status === 'active')
                .map((employee) => (
                  <EmployeeCard 
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    position={employee.position}
                    department={employee.department}
                    email={employee.email}
                    phone={employee.phone}
                    status={employee.status as 'active' | 'on-leave' | 'remote'}
                    imageUrl={employee.imageUrl}
                  />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="remote" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees
                .filter(emp => emp.status === 'remote')
                .map((employee) => (
                  <EmployeeCard 
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    position={employee.position}
                    department={employee.department}
                    email={employee.email}
                    phone={employee.phone}
                    status={employee.status as 'active' | 'on-leave' | 'remote'}
                    imageUrl={employee.imageUrl}
                  />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="on-leave" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees
                .filter(emp => emp.status === 'on-leave')
                .map((employee) => (
                  <EmployeeCard 
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    position={employee.position}
                    department={employee.department}
                    email={employee.email}
                    phone={employee.phone}
                    status={employee.status as 'active' | 'on-leave' | 'remote'}
                    imageUrl={employee.imageUrl}
                  />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Employees;
