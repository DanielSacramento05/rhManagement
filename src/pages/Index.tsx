
import { useEffect } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  BarChart, 
  Calendar, 
  ChevronRight, 
  UserPlus,
  AlertCircle,
  TrendingUp,
  Clock3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { getAbsences } from "@/services/absenceService";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { getCurrentUser } from "@/services/authService";
import { hasPermission, isHRAdmin, isDepartmentManager, getRoleDisplayName } from "@/services/permissionService";
import { TimeClock } from "@/components/timeclock/TimeClock";
import { TimeClockHistory } from "@/components/timeclock/TimeClockHistory";
import { TimeClockManager } from "@/components/timeclock/TimeClockManager";
import { Announcements } from "@/components/announcements/Announcements";
import { AnnouncementManager } from "@/components/announcements/AnnouncementManager";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const isMobile = useIsMobile();
  const currentUser = getCurrentUser();
  const canViewEmployees = hasPermission('employees', 'read', 'department');
  const canViewCompanyAnalytics = hasPermission('analytics', 'read', 'company');
  const canManageAnnouncements = hasPermission('announcements', 'create', 'department');

  // Fetch employees data (only for users with permission)
  const { data: employeesData } = useQuery({
    queryKey: ['employees', { page: 1, pageSize: 50 }],
    queryFn: () => getEmployees({ page: 1, pageSize: 50 }),
    enabled: canViewEmployees,
  });
  
  // Fetch upcoming absences (based on permissions)
  const today = new Date();
  const { data: absencesData } = useQuery({
    queryKey: ['absences', { startDate: format(today, 'yyyy-MM-dd'), status: 'approved' }],
    queryFn: () => getAbsences({
      startDate: format(today, 'yyyy-MM-dd'),
      status: 'approved',
    }),
  });
  
  // Fetch user's own leave requests
  const { data: userAbsencesData } = useQuery({
    queryKey: ['user-absences', currentUser?.id],
    queryFn: () => getAbsences({
      employeeId: currentUser?.id,
    }),
  });
  
  // Get employees by department for chart (only for users with permission)
  const departmentCounts: Record<string, number> = {};
  const employees = employeesData?.data || [];
  const totalEmployees = employeesData?.totalCount || 0;
  
  if (canViewEmployees) {
    employees.forEach(employee => {
      if (employee.department) {
        departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
      }
    });
  }
  
  // Sort departments by count
  const sortedDepartments = Object.entries(departmentCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 6); // Get top 6 departments
  
  // Get upcoming leave requests - with improved data handling (only for managers)
  const upcomingLeave = canViewEmployees ? (absencesData?.data || [])
    .filter(absence => {
      // Skip any absences with missing startDate
      const startDateField = absence.startDate || absence.start_date;
      if (!startDateField) return false;
      
      try {
        const startDate = parseISO(startDateField);
        return isAfter(startDate, today) && isBefore(startDate, addDays(today, 30));
      } catch (error) {
        console.error("Error parsing date:", error, absence);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        // Handle potential undefined values and different field names
        const aStartDate = a.startDate || a.start_date;
        const bStartDate = b.startDate || b.start_date;
        
        if (!aStartDate) return 1;
        if (!bStartDate) return -1;
        return parseISO(aStartDate).getTime() - parseISO(bStartDate).getTime();
      } catch (error) {
        console.error("Error sorting dates:", error);
        return 0;
      }
    })
    .slice(0, 5) : [];
  
  // Get recent employees - improved data handling (only for managers)
  const recentEmployees = canViewEmployees ? [...employees]
    .filter(employee => {
      const hireDateField = employee.hireDate || (employee as any).hire_date;
      return hireDateField;
    })
    .sort((a, b) => {
      const aHireDate = a.hireDate || (a as any).hire_date;
      const bHireDate = b.hireDate || (b as any).hire_date;
      
      if (!aHireDate || !bHireDate) return 0;
      
      try {
        return parseISO(bHireDate).getTime() - parseISO(aHireDate).getTime();
      } catch (error) {
        console.error("Error parsing hire dates:", error);
        return 0;
      }
    })
    .slice(0, 3) : [];

  // Get user's latest leave requests
  const userLeaveRequests = (userAbsencesData?.data || [])
    .sort((a, b) => {
      // Sort by request date if available, otherwise by start date
      const aRequestDate = a.requestDate || (a as any).request_date;
      const bRequestDate = b.requestDate || (b as any).request_date;
      
      if (aRequestDate && bRequestDate) {
        try {
          return new Date(bRequestDate).getTime() - new Date(aRequestDate).getTime();
        } catch (error) {
          console.error("Error parsing request dates:", error);
        }
      }
      
      // Fallback to sorting by start date
      const aStartDate = a.startDate || a.start_date;
      const bStartDate = b.startDate || b.start_date;
      
      if (!aStartDate) return 1;
      if (!bStartDate) return -1;
      
      try {
        return parseISO(bStartDate).getTime() - parseISO(aStartDate).getTime();
      } catch (error) {
        console.error("Error parsing start dates:", error);
        return 0;
      }
    })
    .slice(0, 5);

  useEffect(() => {
    // Simulate data loading with nice animation
    const items = document.querySelectorAll('.animate-in');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  return (
    <div className="page-container pb-16 w-full">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      {/* Content grid now using full width */}
      <div className="w-full mx-auto">
        {/* Employee time clock section - all users (positioned first) */}
        <div className="mb-6 animate-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div>
              <TimeClock />
            </div>
            <div className="lg:col-span-2">
              <TimeClockHistory />
            </div>
          </div>
        </div>

        {/* User's Leave Requests - visible to all users */}
        <div className="mb-6 animate-in">
          <h2 className="section-title flex items-center">
            <Clock3 className="h-5 w-5 mr-2 text-primary" />
            My Leave Requests
          </h2>
          <div className="glass-panel divide-y">
            {userLeaveRequests.length > 0 ? userLeaveRequests.map((leave) => (
              <div key={leave.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {leave.type || "Time Off"} • {(leave.startDate || leave.start_date) && (leave.endDate || leave.end_date) && 
                        `${format(parseISO(leave.startDate || leave.start_date), "dd/MM/yyyy")} - ${format(parseISO(leave.endDate || leave.end_date), "dd/MM/yyyy")}`
                      }
                    </div>
                  </div>
                  <Badge className={`
                    ${leave.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                    ${leave.status === 'declined' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                  `}>
                    {leave.status}
                  </Badge>
                </div>
                {leave.notes && (
                  <div className="text-sm mt-2 italic text-muted-foreground">
                    "{leave.notes}"
                  </div>
                )}
              </div>
            )) : (
              <div className="p-4 text-center text-muted-foreground">
                You don't have any leave requests yet
              </div>
            )}
            <div className="p-3 text-center">
              <Button variant="outline" asChild>
                <Link to="/absences">Manage Leave</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Time Clock Manager for managers */}
        {hasPermission('timeclock', 'read', 'department') && (
          <div className="mb-6 animate-in">
            <TimeClockManager />
          </div>
        )}

        {/* Announcements section - visible to all users */}
        <div className="mb-6 animate-in">
          <Announcements />
        </div>

        {/* Announcement Manager for users with permission */}
        {canManageAnnouncements && (
          <div className="mb-6 animate-in">
            <AnnouncementManager />
          </div>
        )}

        {canViewCompanyAnalytics ? (
          <>
            {/* Manager/HR Admin Dashboard View */}
            
            {/* Key metrics - for users with analytics permission (only Total Employees now) */}
            <div className="dashboard-grid animate-in mb-5 gap-3">
              <DashboardCard 
                title="Total Employees" 
                value={totalEmployees.toString()} 
                icon={<Users className="h-5 w-5" />}
                trend={{ value: 4.6, isPositive: true }}
                footer={canViewEmployees ? <Link to="/employees" className="flex items-center text-muted-foreground hover:text-primary">View all employees <ChevronRight className="h-4 w-4 ml-1" /></Link> : <span className="text-muted-foreground">Company employees</span>}
              />
            </div>

            {/* Manager dashboard layout - charts and info */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 animate-in">
              <div className="lg:col-span-2">
                <h2 className="section-title flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Department Overview
                </h2>
                
                <div className="glass-panel p-4 space-y-3">
                  {sortedDepartments.map(([department, count]) => (
                    <div key={department} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{department}</span>
                        <span className="font-medium">{count} employees</span>
                      </div>
                      <Progress value={Math.round((count / totalEmployees) * 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="section-title flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Leave
                  </h2>
                  
                  <div className="glass-panel divide-y">
                    {upcomingLeave.length > 0 ? upcomingLeave.map((leave) => (
                      <div key={leave.id} className="p-3">
                        <div className="font-medium">{leave.employeeName || (leave as any).employee_name || "Employee"}</div>
                        <div className="text-sm text-muted-foreground">{leave.position || "Position"}</div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm">
                            {(leave.startDate || leave.start_date) && format(parseISO(leave.startDate || leave.start_date), "dd/MM/yyyy")} - 
                            {(leave.endDate || leave.end_date) && format(parseISO(leave.endDate || leave.end_date), "dd/MM/yyyy")}
                          </span>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {leave.type}
                          </Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No upcoming leave requests
                      </div>
                    )}
                    <div className="p-3 text-center">
                      <Button variant="ghost" asChild>
                        <Link to="/absences">View all leave</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="section-title flex items-center">
                    <UserPlus className="h-5 w-5 mr-2 text-primary" />
                    Recent Hires
                  </h2>
                  
                  <div className="glass-panel divide-y">
                    {recentEmployees.length > 0 ? recentEmployees.map((employee) => (
                      <div key={employee.id} className="p-3">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.position}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Joined: {(employee.hireDate || (employee as any).hire_date) ? format(parseISO(employee.hireDate || (employee as any).hire_date), "dd/MM/yyyy") : "N/A"}
                        </div>
                      </div>
                    )) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No recent hires
                      </div>
                    )}
                    <div className="p-3 text-center">
                      <Button variant="ghost" asChild>
                        <Link to="/employees">View all employees</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
