
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
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
import { getAbsences } from "@/services/absenceService";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { getCurrentUser, isUserManager } from "@/services/authService";
import { TimeClock } from "@/components/timeclock/TimeClock";
import { TimeClockHistory } from "@/components/timeclock/TimeClockHistory";
import { TimeClockManager } from "@/components/timeclock/TimeClockManager";
import { Announcements } from "@/components/announcements/Announcements";
import { AnnouncementManager } from "@/components/announcements/AnnouncementManager";

const Index = () => {
  const isMobile = useIsMobile();
  const currentUser = getCurrentUser();
  const isManager = isUserManager();
  const isTeamLeader = currentUser?.role === 'manager';
  const isHRManager = currentUser?.role === 'admin';

  // Fetch employees data (only for managers)
  const { data: employeesData } = useQuery({
    queryKey: ['employees', { page: 1, pageSize: 50 }],
    queryFn: () => getEmployees({ page: 1, pageSize: 50 }),
    enabled: isTeamLeader || isHRManager,
  });
  
  // Fetch upcoming absences (only for managers)
  const today = new Date();
  const { data: absencesData } = useQuery({
    queryKey: ['absences', { startDate: format(today, 'yyyy-MM-dd'), status: 'approved' }],
    queryFn: () => getAbsences({
      startDate: format(today, 'yyyy-MM-dd'),
      status: 'approved',
    }),
    enabled: isTeamLeader || isHRManager,
  });
  
  // Get employees by department for chart (only for managers)
  const departmentCounts: Record<string, number> = {};
  const employees = employeesData?.data || [];
  const totalEmployees = employeesData?.totalCount || 0;
  
  if (isTeamLeader || isHRManager) {
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
  
  // Get upcoming leave requests - with null/undefined safety checks (only for managers)
  const upcomingLeave = (isTeamLeader || isHRManager) ? (absencesData?.data || [])
    .filter(absence => {
      // Skip any absences with missing startDate
      if (!absence.startDate) return false;
      
      try {
        const startDate = parseISO(absence.startDate);
        return isAfter(startDate, today) && isBefore(startDate, addDays(today, 30));
      } catch (error) {
        console.error("Error parsing date:", error, absence);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        // Handle potential undefined values
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
      } catch (error) {
        console.error("Error sorting dates:", error);
        return 0;
      }
    })
    .slice(0, 5) : [];
  
  // Get recent employees (sort by hire date if available) (only for managers)
  const recentEmployees = (isTeamLeader || isHRManager) ? [...employees]
    .filter(employee => employee.hireDate)
    .sort((a, b) => {
      if (!a.hireDate || !b.hireDate) return 0;
      return parseISO(b.hireDate).getTime() - parseISO(a.hireDate).getTime();
    })
    .slice(0, 3) : [];

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
    <div className="page-container pb-16">
      <div className="animate-in">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back to your HR management portal.</p>
      </div>

      {/* Employee time clock section - all users (positioned first) */}
      <div className="mb-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <TimeClock />
          </div>
          <div className="lg:col-span-2">
            <TimeClockHistory />
          </div>
        </div>
      </div>

      {/* Announcements section - visible to all users */}
      <div className="mb-8 animate-in">
        <Announcements />
      </div>

      {isTeamLeader || isHRManager ? (
        <>
          {/* Manager Dashboard View */}
          
          {/* Time Clock Manager */}
          <div className="mb-8 animate-in">
            <TimeClockManager />
          </div>
          
          {/* Key metrics - managers only */}
          <div className="dashboard-grid animate-in mb-8">
            <DashboardCard 
              title="Total Employees" 
              value={totalEmployees.toString()} 
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 4.6, isPositive: true }}
              footer={<Link to="/employees" className="flex items-center text-muted-foreground hover:text-primary">View all employees <ChevronRight className="h-4 w-4 ml-1" /></Link>}
            />
            
            <DashboardCard 
              title="Avg. Attendance" 
              value="92%" 
              icon={<Clock className="h-5 w-5" />}
              trend={{ value: 1.2, isPositive: true }}
              footer={<span className="text-muted-foreground">Last 30 days</span>}
            />
            
            <DashboardCard 
              title="Open Positions" 
              value="12" 
              icon={<UserPlus className="h-5 w-5" />}
              trend={{ value: 2, isPositive: false }}
              footer={<span className="text-muted-foreground">4 in final interview stage</span>}
            />
          </div>

          {/* Manager dashboard layout - charts and info */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in">
            <div className="lg:col-span-2">
              <h2 className="section-title flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Department Overview
              </h2>
              
              <div className="glass-panel p-6 space-y-4">
                {sortedDepartments.map(([department, count]) => (
                  <div key={department} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{department}</span>
                      <span className="font-medium">{count} employees</span>
                    </div>
                    <Progress value={Math.round((count / totalEmployees) * 100)} className="h-2" />
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h2 className="section-title flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                  Manage Announcements
                </h2>
                
                <AnnouncementManager />
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="section-title flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Leave
                </h2>
                
                <div className="glass-panel divide-y">
                  {upcomingLeave.length > 0 ? upcomingLeave.map((leave) => (
                    <div key={leave.id} className="p-4">
                      <div className="font-medium">{leave.employeeName || "Employee"}</div>
                      <div className="text-sm text-muted-foreground">{leave.position || "Position"}</div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm">
                          {leave.startDate && format(parseISO(leave.startDate), "dd/MM/yyyy")} - 
                          {leave.endDate && format(parseISO(leave.endDate), "dd/MM/yyyy")}
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {leave.type}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No upcoming leave requests
                    </div>
                  )}
                  <div className="p-4 text-center">
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
                    <div key={employee.id} className="p-4">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.position}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Joined: {employee.hireDate ? format(parseISO(employee.hireDate), "dd/MM/yyyy") : "N/A"}
                      </div>
                    </div>
                  )) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No recent hires
                    </div>
                  )}
                  <div className="p-4 text-center">
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
  );
};

export default Index;
