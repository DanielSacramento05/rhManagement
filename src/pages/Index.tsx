
import { useEffect } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  BarChart, 
  Calendar, 
  ChevronRight, 
  BellRing,
  FileCheck,
  UserPlus,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

// Mock data
const recentEmployees = [
  { id: '1', name: 'Sarah Johnson', position: 'UX Designer', date: 'Aug 15, 2023' },
  { id: '2', name: 'Michael Chen', position: 'Software Engineer', date: 'Aug 12, 2023' },
  { id: '3', name: 'Emma Rodriguez', position: 'Product Manager', date: 'Aug 10, 2023' },
];

const upcomingLeave = [
  { id: '1', name: 'David Wilson', position: 'Marketing Director', startDate: 'Sep 1', endDate: 'Sep 15', type: 'Vacation' },
  { id: '2', name: 'Lisa Taylor', position: 'HR Specialist', startDate: 'Sep 5', endDate: 'Sep 7', type: 'Personal' },
];

const pendingTasks = [
  { id: '1', title: 'Review performance reports', due: 'Today', priority: 'High' },
  { id: '2', title: 'Approve team vacations', due: 'Tomorrow', priority: 'Medium' },
  { id: '3', title: 'Finalize new hire paperwork', due: 'Sep 3', priority: 'Medium' },
  { id: '4', title: 'Monthly department budgets', due: 'Sep 5', priority: 'High' },
];

const Index = () => {
  const isMobile = useIsMobile();

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

      {/* Key metrics */}
      <div className="dashboard-grid animate-in">
        <DashboardCard 
          title="Total Employees" 
          value="243" 
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

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in">
        <div className="lg:col-span-2">
          <h2 className="section-title flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            Department Overview
          </h2>
          
          <div className="glass-panel p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engineering</span>
                <span className="font-medium">68 employees</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sales & Marketing</span>
                <span className="font-medium">53 employees</span>
              </div>
              <Progress value={53} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Product</span>
                <span className="font-medium">47 employees</span>
              </div>
              <Progress value={47} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Operations</span>
                <span className="font-medium">41 employees</span>
              </div>
              <Progress value={41} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Human Resources</span>
                <span className="font-medium">24 employees</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Finance</span>
                <span className="font-medium">10 employees</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="section-title flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-primary" />
              Pending Tasks
            </h2>
            
            <div className="glass-panel divide-y">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">Due: {task.due}</div>
                  </div>
                  <Badge 
                    className={task.priority === 'High' 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
              <div className="p-4 text-center">
                <Button variant="ghost">View all tasks</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="section-title flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Leave
            </h2>
            
            <div className="glass-panel divide-y">
              {upcomingLeave.map((leave) => (
                <div key={leave.id} className="p-4">
                  <div className="font-medium">{leave.name}</div>
                  <div className="text-sm text-muted-foreground">{leave.position}</div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm">
                      {leave.startDate} - {leave.endDate}
                    </span>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {leave.type}
                    </Badge>
                  </div>
                </div>
              ))}
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
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="p-4">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.position}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Joined: {employee.date}</div>
                </div>
              ))}
              <div className="p-4 text-center">
                <Button variant="ghost" asChild>
                  <Link to="/employees">View all employees</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="section-title flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Announcements
            </h2>
            
            <div className="glass-panel p-4">
              <div className="flex items-start gap-3">
                <BellRing className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Quarterly Review</h3>
                  <p className="text-sm text-muted-foreground">Quarterly reviews scheduled for the second week of September.</p>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Employee Engagement Survey</h3>
                  <p className="text-sm text-muted-foreground">Please complete the survey by August 29th.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import Badge after using it
import { Badge } from "@/components/ui/badge";

export default Index;
