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
  Clock3,
  Briefcase
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
          // Fallback to start date sorting
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
        return 0;
      }
    })
    .slice(0, 5);

  // Helper function to format date range for leave requests
  const formatDateRange = (leave: any) => {
    // The API returns start_date and end_date (with underscores)
    const startDate = leave.start_date || leave.startDate;
    const endDate = leave.end_date || leave.endDate;
    
    if (!startDate) {
      return "";
    }
    
    try {
      const formattedStartDate = format(parseISO(startDate), "dd/MM/yyyy");
      
      if (!endDate) {
        return formattedStartDate;
      }
      
      const formattedEndDate = format(parseISO(endDate), "dd/MM/yyyy");
      
      // If it's the same date, just show one date
      if (formattedStartDate === formattedEndDate) {
        return formattedStartDate;
      }
      
      return `${formattedStartDate} - ${formattedEndDate}`;
    } catch (error) {
      return "";
    }
  };

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
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      <div className="w-full mx-auto space-y-8">
        {/* Welcome Section */}
        <section className="animate-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {currentUser?.name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening at your workplace today
            </p>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard 
              title="Clock In/Out" 
              icon={<Clock className="h-5 w-5" />}
              footer={<Link to="#timeclock" className="flex items-center text-muted-foreground hover:text-primary">Manage time <ChevronRight className="h-4 w-4 ml-1" /></Link>}
            />
            <DashboardCard 
              title="Request Leave" 
              icon={<Calendar className="h-5 w-5" />}
              footer={<Link to="/absences" className="flex items-center text-muted-foreground hover:text-primary">View absences <ChevronRight className="h-4 w-4 ml-1" /></Link>}
            />
            {canViewEmployees && (
              <DashboardCard 
                title="Team Directory" 
                icon={<Users className="h-5 w-5" />}
                footer={<Link to="/employees" className="flex items-center text-muted-foreground hover:text-primary">View employees <ChevronRight className="h-4 w-4 ml-1" /></Link>}
              />
            )}
            <DashboardCard 
              title="My Profile" 
              icon={<Briefcase className="h-5 w-5" />}
              footer={<Link to="/profile" className="flex items-center text-muted-foreground hover:text-primary">Edit profile <ChevronRight className="h-4 w-4 ml-1" /></Link>}
            />
          </div>
        </section>

        {/* Time Tracking Section */}
        <section className="animate-in" id="timeclock">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-primary" />
              Time Tracking
            </h2>
            <p className="text-muted-foreground">Manage your work hours and view recent activity</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TimeClock />
            </div>
            <div className="lg:col-span-2">
              <TimeClockHistory />
            </div>
          </div>
        </section>

        {/* Time Clock Manager for managers */}
        {hasPermission('timeclock', 'read', 'department') && (
          <section className="animate-in">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground">Team Time Management</h3>
              <p className="text-muted-foreground">Monitor and manage your team's time tracking</p>
            </div>
            <TimeClockManager />
          </section>
        )}

        <Separator className="my-8" />

        {/* Personal Section */}
        <section className="animate-in">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              <Clock3 className="h-6 w-6 mr-3 text-primary" />
              My Leave Requests
            </h2>
            <p className="text-muted-foreground">Track your time off requests and status</p>
          </div>
          
          <div className="glass-panel divide-y">
            {userLeaveRequests.length > 0 ? userLeaveRequests.map((leave) => (
              <div key={leave.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-lg mb-2">
                      {leave.type || "Time Off"} • {formatDateRange(leave)}
                    </div>
                    {leave.notes && (
                      <div className="text-sm text-muted-foreground italic mb-2">
                        "{leave.notes}"
                      </div>
                    )}
                  </div>
                  <Badge className={`
                    ${leave.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                    ${leave.status === 'declined' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                  `}>
                    {leave.status}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No leave requests yet</h3>
                <p className="mb-4">You haven't submitted any time off requests</p>
                <Button variant="outline" asChild>
                  <Link to="/absences">Request Time Off</Link>
                </Button>
              </div>
            )}
            {userLeaveRequests.length > 0 && (
              <div className="p-4 text-center bg-muted/20">
                <Button variant="outline" asChild>
                  <Link to="/absences">Manage All Leave Requests</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Communication Section */}
        <section className="animate-in">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              <AlertCircle className="h-6 w-6 mr-3 text-primary" />
              Company Updates
            </h2>
            <p className="text-muted-foreground">Stay informed with the latest announcements</p>
          </div>
          <Announcements />
        </section>

        {/* Announcement Manager for users with permission */}
        {canManageAnnouncements && (
          <section className="animate-in">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-foreground">Manage Announcements</h3>
              <p className="text-muted-foreground">Create and manage company-wide communications</p>
            </div>
            <AnnouncementManager />
          </section>
        )}

        {/* Management Dashboard */}
        {canViewCompanyAnalytics && (
          <>
            <Separator className="my-8" />
            
            {/* Company Analytics Header */}
            <section className="animate-in">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-primary" />
                  Company Analytics
                </h2>
                <p className="text-muted-foreground">Overview of company metrics and team performance</p>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard 
                  title="Total Employees" 
                  value={totalEmployees.toString()} 
                  icon={<Users className="h-5 w-5" />}
                  trend={{ value: 4.6, isPositive: true }}
                  footer={canViewEmployees ? <Link to="/employees" className="flex items-center text-muted-foreground hover:text-primary">View all employees <ChevronRight className="h-4 w-4 ml-1" /></Link> : <span className="text-muted-foreground">Company employees</span>}
                />
                <DashboardCard 
                  title="Active Departments" 
                  value={sortedDepartments.length.toString()} 
                  icon={<BarChart className="h-5 w-5" />}
                  footer={<span className="text-muted-foreground">Across organization</span>}
                />
                <DashboardCard 
                  title="Upcoming Leave" 
                  value={upcomingLeave.length.toString()} 
                  icon={<Calendar className="h-5 w-5" />}
                  footer={<Link to="/absences" className="flex items-center text-muted-foreground hover:text-primary">Manage leave <ChevronRight className="h-4 w-4 ml-1" /></Link>}
                />
                <DashboardCard 
                  title="Recent Hires" 
                  value={recentEmployees.length.toString()} 
                  icon={<UserPlus className="h-5 w-5" />}
                  footer={<span className="text-muted-foreground">Last 30 days</span>}
                />
              </div>
            </section>

            {/* Detailed Analytics */}
            <section className="animate-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Department Overview */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-primary" />
                      Department Distribution
                    </h3>
                    <p className="text-muted-foreground">Employee distribution across departments</p>
                  </div>
                  
                  <div className="glass-panel p-6 space-y-6">
                    {sortedDepartments.map(([department, count]) => (
                      <div key={department} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-base">{department}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">{count} employees</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({Math.round((count / totalEmployees) * 100)}%)
                            </span>
                          </div>
                        </div>
                        <Progress value={Math.round((count / totalEmployees) * 100)} className="h-3" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right Sidebar */}
                <div className="space-y-8">
                  {/* Upcoming Leave */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Upcoming Leave
                      </h3>
                      <p className="text-muted-foreground text-sm">Next 30 days</p>
                    </div>
                    
                    <div className="glass-panel divide-y">
                      {upcomingLeave.length > 0 ? upcomingLeave.map((leave) => (
                        <div key={leave.id} className="p-4">
                          <div className="font-medium text-sm mb-1">{leave.employeeName || (leave as any).employee_name || "Employee"}</div>
                          <div className="text-xs text-muted-foreground mb-2">{leave.position || "Position"}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {(leave.startDate || leave.start_date) && format(parseISO(leave.startDate || leave.start_date), "dd/MM")} - 
                              {(leave.endDate || leave.end_date) && format(parseISO(leave.endDate || leave.end_date), "dd/MM")}
                            </span>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">
                              {leave.type}
                            </Badge>
                          </div>
                        </div>
                      )) : (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p>No upcoming leave</p>
                        </div>
                      )}
                      <div className="p-3 text-center bg-muted/20">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/absences">View All Leave</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Hires */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-primary" />
                        Recent Hires
                      </h3>
                      <p className="text-muted-foreground text-sm">Latest team members</p>
                    </div>
                    
                    <div className="glass-panel divide-y">
                      {recentEmployees.length > 0 ? recentEmployees.map((employee) => (
                        <div key={employee.id} className="p-4">
                          <div className="font-medium text-sm mb-1">{employee.name}</div>
                          <div className="text-xs text-muted-foreground mb-1">{employee.position}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined: {(employee.hireDate || (employee as any).hire_date) ? format(parseISO(employee.hireDate || (employee as any).hire_date), "dd/MM/yyyy") : "N/A"}
                          </div>
                        </div>
                      )) : (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                          <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p>No recent hires</p>
                        </div>
                      )}
                      <div className="p-3 text-center bg-muted/20">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/employees">View All Employees</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
