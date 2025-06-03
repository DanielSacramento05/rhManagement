
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  BookOpen,
  Users,
  Calendar,
  BarChart,
  LogIn, 
  UserPlus, 
  Home, 
  Pencil,
  HelpCircle,
  Clock,
  Megaphone,
  Settings,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Filter,
  Search,
  Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/services/authService";

export default function Tutorial() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("getting-started");
  const isLoggedIn = isAuthenticated();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row items-start gap-10">
        {/* Left sidebar with navigation */}
        <div className="w-full md:w-64 md:sticky md:top-20">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                User Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1">
                <TabsList className="flex flex-col h-auto bg-transparent gap-1" orientation="vertical">
                  <TabsTrigger
                    value="getting-started"
                    className="justify-start"
                    onClick={() => handleTabChange("getting-started")}
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Getting Started</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="account-setup"
                    className="justify-start"
                    onClick={() => handleTabChange("account-setup")}
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Account Setup</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="dashboard-guide"
                    className="justify-start"
                    onClick={() => handleTabChange("dashboard-guide")}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Dashboard Guide</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="time-tracking"
                    className="justify-start"
                    onClick={() => handleTabChange("time-tracking")}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Time Tracking</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="absence-requests"
                    className="justify-start"
                    onClick={() => handleTabChange("absence-requests")}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Absence Requests</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="employee-management"
                    className="justify-start"
                    onClick={() => handleTabChange("employee-management")}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Managing Employees</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="performance-reviews"
                    className="justify-start"
                    onClick={() => handleTabChange("performance-reviews")}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>Performance Reviews</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="announcements-guide"
                    className="justify-start"
                    onClick={() => handleTabChange("announcements-guide")}
                  >
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4" />
                      <span>Announcements</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile-settings"
                    className="justify-start"
                    onClick={() => handleTabChange("profile-settings")}
                  >
                    <div className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      <span>Profile & Settings</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="troubleshooting"
                    className="justify-start"
                    onClick={() => handleTabChange("troubleshooting")}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Troubleshooting</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="mt-6">
                {!isLoggedIn ? (
                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={() => navigate("/")}
                  >
                    <Home className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <TabsContent value="getting-started">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  <CardTitle>Welcome to HR Management System</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What is this system?</h3>
                  <p>
                    The HR Management System is your one-stop solution for all human resource needs. 
                    Whether you're an employee tracking your time, a manager reviewing performance, 
                    or an administrator managing the entire organization, this platform provides 
                    intuitive tools to streamline your workflow.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">Quick Start Tip</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Your user role determines what features you can access. Don't worry if you 
                          can't see certain options - they may be restricted to managers or administrators.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">User Roles Explained</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-800">Employee</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Self-service features: clock in/out, request time off, view your profile, 
                        and access personal performance reviews.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Team management: approve absences, conduct reviews, view team analytics, 
                        plus all employee features.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Full system access: user management, system configuration, company-wide 
                        reports, plus all other features.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Navigation Overview</h3>
                  <p>The main navigation bar at the top provides access to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Dashboard:</strong> Your personal overview and quick actions</li>
                    <li><strong>Employees:</strong> Directory and employee management</li>
                    <li><strong>Absences:</strong> Time-off requests and calendar</li>
                    <li><strong>Performance:</strong> Reviews and goal tracking</li>
                    <li><strong>Announcements:</strong> Company news and updates</li>
                  </ul>

                  <div className="pt-4">
                    <Button onClick={() => handleTabChange("account-setup")}>
                      Next: Account Setup →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account-setup">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                  <CardTitle>Account Setup & First Login</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Creating Your Account</h3>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-muted-foreground mb-2">Two Ways to Get Started:</p>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">1. New Registration:</span>
                        <p className="text-sm">If you're new to the company, register with your details</p>
                      </div>
                      <div>
                        <span className="font-medium">2. Existing Employee:</span>
                        <p className="text-sm">If you're already in the system, just set your password</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Step-by-Step Registration</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Go to the login page</span>
                      <p className="text-muted-foreground text-sm">
                        Click "Login" in the top navigation or visit the login URL directly.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Click "Register" tab</span>
                      <p className="text-muted-foreground text-sm">
                        Switch from the login form to the registration form.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Enter your email</span>
                      <p className="text-muted-foreground text-sm">
                        The system will automatically check if you're already in the employee database. 
                        If found, you'll only need to set a password.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Complete the form</span>
                      <div className="text-muted-foreground text-sm space-y-1">
                        <p><strong>For new users:</strong> Name, email, phone (optional), and password</p>
                        <p><strong>For existing employees:</strong> Just email and password</p>
                      </div>
                    </li>
                    <li>
                      <span className="font-medium">Set up your profile</span>
                      <p className="text-muted-foreground text-sm">
                        After registration, complete your profile with job title, department, and additional details.
                      </p>
                    </li>
                  </ol>

                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
                    <p className="font-medium text-amber-700 dark:text-amber-300">Smart Email Detection</p>
                    <p className="text-amber-600 dark:text-amber-400 text-sm">
                      When you enter your email, the system automatically detects if you're already 
                      an employee. If so, you'll see a personalized welcome message and only need 
                      to set your password!
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold">Password Requirements</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Minimum 6 characters</li>
                    <li>Passwords must match in both fields</li>
                    <li>Choose something secure but memorable</li>
                  </ul>

                  <h3 className="text-lg font-semibold">After Registration</h3>
                  <p>Once your account is created:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>New users: Complete profile setup with job details</li>
                    <li>Existing employees: Go directly to the dashboard</li>
                    <li>Explore the features available for your role</li>
                    <li>Update your profile picture and contact information</li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("getting-started")}>
                      ← Previous: Getting Started
                    </Button>
                    <Button onClick={() => handleTabChange("dashboard-guide")}>
                      Next: Dashboard Guide →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard-guide">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-primary" />
                  <CardTitle>Dashboard Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Personal Command Center</h3>
                  <p>
                    The dashboard is designed to give you immediate access to the most important 
                    information and actions for your role. It's personalized based on your 
                    permissions and responsibilities.
                  </p>

                  <h3 className="text-lg font-semibold">Dashboard Sections</h3>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Recent Announcements</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Stay updated with the latest company news, policy changes, and important 
                        notifications. High-priority announcements appear prominently at the top.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Quick Stats</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Key metrics relevant to your role - employees might see their attendance, 
                        while managers see team statistics and pending approvals.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Plus className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Quick Actions</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        One-click access to frequently used features like clocking in/out, 
                        requesting time off, or adding new employees (for admins).
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Role-Specific Dashboard Views</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-green-700">Employee Dashboard Shows:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Current time tracking status</li>
                        <li>Upcoming time off</li>
                        <li>Recent announcements</li>
                        <li>Quick time clock actions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium text-blue-700">Manager Dashboard Shows:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Team member status overview</li>
                        <li>Pending absence approvals</li>
                        <li>Upcoming performance reviews</li>
                        <li>Department analytics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium text-purple-700">Admin Dashboard Shows:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>System-wide statistics</li>
                        <li>User management shortcuts</li>
                        <li>Company-wide reports</li>
                        <li>System health indicators</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Navigation Tips</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Profile Access:</span> Click your avatar in the 
                      top-right corner to access profile settings and logout
                    </li>
                    <li>
                      <span className="font-medium">Mobile-Friendly:</span> On mobile devices, use 
                      the sidebar trigger button for easy navigation
                    </li>
                    <li>
                      <span className="font-medium">Real-Time Updates:</span> The dashboard refreshes 
                      automatically to show the latest information
                    </li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("account-setup")}>
                      ← Previous: Account Setup
                    </Button>
                    <Button onClick={() => handleTabChange("time-tracking")}>
                      Next: Time Tracking →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-tracking">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <CardTitle>Time Tracking Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Digital Time Clock System</h3>
                  <p>
                    Track your work hours accurately with our digital time clock. The system 
                    automatically records timestamps and calculates your daily and weekly totals.
                  </p>

                  <h3 className="text-lg font-semibold">How to Clock In/Out</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Starting Your Day</span>
                      <p className="text-muted-foreground text-sm">
                        Click the "Clock In" button when you arrive at work. Your status will 
                        automatically change to "Active" and the timestamp is recorded.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Taking Breaks</span>
                      <p className="text-muted-foreground text-sm">
                        You can clock out for lunch breaks and clock back in. Each session 
                        is tracked separately.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Ending Your Day</span>
                      <p className="text-muted-foreground text-sm">
                        Click "Clock Out" when leaving work. Your status changes to "Out of Office" 
                        and total work time is calculated.
                      </p>
                    </li>
                  </ol>

                  <h3 className="text-lg font-semibold">Work Status Indicators</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-2 p-3 border rounded">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <span className="text-sm">Currently working</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded">
                      <Badge className="bg-blue-100 text-blue-800">Remote</Badge>
                      <span className="text-sm">Working from home</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded">
                      <Badge className="bg-gray-100 text-gray-800">Out of Office</Badge>
                      <span className="text-sm">Not working</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Viewing Your Time History</h3>
                  <p>Access your complete time tracking history to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Review daily work hours and patterns</li>
                    <li>Check weekly and monthly totals</li>
                    <li>Verify overtime calculations</li>
                    <li>Export timesheet data for payroll</li>
                  </ul>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">Pro Tip</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Your time clock status is visible to managers and affects your profile 
                          status throughout the system. Make sure to clock in/out consistently 
                          for accurate tracking.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Manager Features</h3>
                  <p>If you're a manager, you can also:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>View real-time status of all team members</li>
                    <li>Generate time reports for your department</li>
                    <li>Monitor attendance patterns and trends</li>
                    <li>Export team timesheet data</li>
                  </ul>

                  <h3 className="text-lg font-semibold">Common Questions</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">What if I forget to clock in/out?</span>
                      <p className="text-sm text-muted-foreground">
                        Contact your manager or HR administrator to manually adjust your time entries.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Can I clock in from home?</span>
                      <p className="text-sm text-muted-foreground">
                        Yes! The system supports remote work. Your status will show as "Remote" 
                        when working from home.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("dashboard-guide")}>
                      ← Previous: Dashboard Guide
                    </Button>
                    <Button onClick={() => handleTabChange("absence-requests")}>
                      Next: Absence Requests →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="absence-requests">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <CardTitle>Absence Requests Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Requesting Time Off</h3>
                  <p>
                    The absence management system streamlines time-off requests and approvals, 
                    making it easy to plan and track your vacation, sick days, and other absences.
                  </p>

                  <h3 className="text-lg font-semibold">How to Request Time Off</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Navigate to Absences</span>
                      <p className="text-muted-foreground text-sm">
                        Click "Absences" in the main navigation menu.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Click "Request Time Off"</span>
                      <p className="text-muted-foreground text-sm">
                        The blue "Request Time Off" button opens the request form.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Fill Out the Form</span>
                      <div className="text-muted-foreground text-sm space-y-1">
                        <p>• <strong>Type:</strong> Select from Vacation, Sick Leave, Personal, or Training</p>
                        <p>• <strong>Start Date:</strong> First day of your absence</p>
                        <p>• <strong>End Date:</strong> Last day of your absence</p>
                        <p>• <strong>Reason:</strong> Brief explanation (optional but recommended)</p>
                      </div>
                    </li>
                    <li>
                      <span className="font-medium">Submit Request</span>
                      <p className="text-muted-foreground text-sm">
                        Your request is automatically sent to your manager for approval.
                      </p>
                    </li>
                  </ol>

                  <h3 className="text-lg font-semibold">Request Status Types</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-2 p-3 border rounded">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      <span className="text-sm">Waiting for approval</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded">
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                      <span className="text-sm">Request accepted</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded">
                      <Badge className="bg-red-100 text-red-800">Declined</Badge>
                      <span className="text-sm">Request denied</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Employee View Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">View Your Requests:</span> See all your 
                      time-off requests in chronological order
                    </li>
                    <li>
                      <span className="font-medium">Filter by Status:</span> Use the dropdown 
                      to filter by Pending, Approved, or Declined requests
                    </li>
                    <li>
                      <span className="font-medium">Request Details:</span> Each card shows 
                      dates, type, reason, and current status
                    </li>
                    <li>
                      <span className="font-medium">Quick Actions:</span> Request new time off 
                      directly from the absence page
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold">Manager Approval Process</h3>
                  <p>If you're a manager, you'll see additional features:</p>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Team Requests Tab:</span>
                      <p className="text-sm text-muted-foreground">
                        View all pending requests from your team members in one place.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Approve/Decline Actions:</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click these buttons on pending requests to approve or decline them.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
                    <p className="font-medium text-amber-700 dark:text-amber-300">Planning Ahead</p>
                    <p className="text-amber-600 dark:text-amber-400 text-sm">
                      Submit time-off requests as early as possible to give your manager time 
                      to review and ensure adequate coverage. Some companies may have minimum 
                      advance notice requirements.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold">Best Practices</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Submit requests well in advance for planned vacations</li>
                    <li>Provide clear reasons to help managers make informed decisions</li>
                    <li>Check team calendars to avoid conflicts with major projects</li>
                    <li>Follow up if you don't receive approval within a reasonable time</li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("time-tracking")}>
                      ← Previous: Time Tracking
                    </Button>
                    <Button onClick={() => handleTabChange("employee-management")}>
                      Next: Managing Employees →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employee-management">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle>Employee Management Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Employee Directory</h3>
                  <p>
                    The Employees section provides a comprehensive directory of all organization 
                    members with powerful search, filtering, and management capabilities.
                  </p>

                  <h3 className="text-lg font-semibold">Viewing Employee Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Employee Cards Display:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Profile picture and name</li>
                        <li>Job title and department</li>
                        <li>Current work status (In Office, Remote, etc.)</li>
                        <li>Contact information</li>
                        <li>"View Profile" button for detailed information</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Search and Filter Features</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4" />
                        <span className="font-medium">Search Functionality</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Use the search bar to find employees by name, email, or job title. 
                        The search is real-time and case-insensitive.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-4 w-4" />
                        <span className="font-medium">Status Filters</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800">In Office</Badge>
                        <Badge className="bg-blue-100 text-blue-800">Remote</Badge>
                        <Badge className="bg-amber-100 text-amber-800">On Leave</Badge>
                        <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click any status badge to filter employees by their current work status.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Employee Profile Details</h3>
                  <p>Clicking "View Profile" on any employee card shows:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Complete contact information and emergency contacts</li>
                    <li>Employment history and start date</li>
                    <li>Department and reporting structure</li>
                    <li>Recent time tracking activity</li>
                    <li>Performance review history (if you have permission)</li>
                  </ul>

                  <h3 className="text-lg font-semibold">Admin Management Features</h3>
                  <p>Administrators have access to advanced employee management:</p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Adding New Employees:</span>
                      <ol className="list-decimal pl-6 text-sm mt-1">
                        <li>Click the "Add Employee" button</li>
                        <li>Fill out the comprehensive employee form</li>
                        <li>Set initial role and department</li>
                        <li>Send invitation for account setup</li>
                      </ol>
                    </div>
                    
                    <div>
                      <span className="font-medium">Managing Employee Status:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Change work status (In Office ↔ Remote ↔ On Leave)</li>
                        <li>Activate/deactivate employee accounts</li>
                        <li>Update department assignments</li>
                        <li>Modify role permissions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Bulk Operations:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Export employee data to CSV/Excel</li>
                        <li>Import new employees from spreadsheets</li>
                        <li>Send bulk notifications or announcements</li>
                        <li>Generate department reports</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Privacy Note</p>
                        <p className="text-green-600 dark:text-green-400 text-sm">
                          What you can see depends on your role. Employees see basic directory 
                          information, managers see their team details, and admins have full access 
                          to all employee data.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Mobile-Friendly Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Responsive design works perfectly on phones and tablets</li>
                    <li>Touch-friendly interface for easy navigation</li>
                    <li>Quick access to contact information for calling or messaging</li>
                    <li>Optimized search and filtering on smaller screens</li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("absence-requests")}>
                      ← Previous: Absence Requests
                    </Button>
                    <Button onClick={() => handleTabChange("performance-reviews")}>
                      Next: Performance Reviews →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance-reviews">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  <CardTitle>Performance Reviews Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Management System</h3>
                  <p>
                    Our performance review system helps track employee growth, set goals, 
                    and conduct regular assessments to support career development and 
                    organizational success.
                  </p>

                  <h3 className="text-lg font-semibold">Types of Reviews</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Quarterly Reviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Regular check-ins every 3 months to discuss progress, challenges, 
                        and short-term goals.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Semi-Annual Reviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Mid-year comprehensive assessments covering goal progress and 
                        development planning.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Annual Reviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive yearly evaluations including salary reviews and 
                        career planning discussions.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Employee Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Viewing Your Reviews:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Access all your performance review history</li>
                        <li>View feedback and ratings from managers</li>
                        <li>Track your goal progress over time</li>
                        <li>See improvement trends and achievements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Self-Assessment Process:</span>
                      <ol className="list-decimal pl-6 text-sm mt-1">
                        <li>Receive notification when self-assessment is due</li>
                        <li>Complete reflection on your performance and achievements</li>
                        <li>Rate yourself on key competencies</li>
                        <li>Submit before scheduled manager review</li>
                      </ol>
                    </div>
                    
                    <div>
                      <span className="font-medium">Goal Tracking:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>View goals assigned by your manager</li>
                        <li>Update progress on ongoing objectives</li>
                        <li>Add notes about challenges or achievements</li>
                        <li>Request goal modifications if circumstances change</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Manager Review Process</h3>
                  <p>For managers conducting reviews:</p>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Scheduling Reviews:</span>
                      <ol className="list-decimal pl-6 text-sm mt-1">
                        <li>Navigate to Performance section</li>
                        <li>Click "Schedule Review" for team members</li>
                        <li>Set review type and target completion date</li>
                        <li>System sends automatic notifications to employee</li>
                      </ol>
                    </div>
                    
                    <div>
                      <span className="font-medium">Conducting Assessments:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Review employee's self-assessment first</li>
                        <li>Rate performance across key competencies</li>
                        <li>Provide detailed feedback and examples</li>
                        <li>Set goals for the next review period</li>
                        <li>Schedule follow-up meetings as needed</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Goal Management</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">SMART Goals Framework:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li><strong>Specific:</strong> Clear, well-defined objectives</li>
                        <li><strong>Measurable:</strong> Quantifiable success criteria</li>
                        <li><strong>Achievable:</strong> Realistic and attainable</li>
                        <li><strong>Relevant:</strong> Aligned with role and company objectives</li>
                        <li><strong>Time-bound:</strong> Clear deadlines and milestones</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Goal Categories:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Performance goals (KPIs, metrics, targets)</li>
                        <li>Development goals (skills, training, certifications)</li>
                        <li>Behavioral goals (leadership, communication, teamwork)</li>
                        <li>Career goals (promotion, role changes, growth)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <BarChart className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">Performance Analytics</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          The system automatically tracks performance trends, goal completion rates, 
                          and provides insights to help managers identify top performers and areas 
                          for team development.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Review Preparation Tips</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">For Employees:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Keep a record of achievements throughout the period</li>
                        <li>Gather examples of successful projects and initiatives</li>
                        <li>Reflect on challenges and how you overcame them</li>
                        <li>Prepare questions about career development and growth</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">For Managers:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Review employee's work samples and contributions</li>
                        <li>Gather 360-degree feedback from colleagues</li>
                        <li>Prepare specific examples for both praise and improvement areas</li>
                        <li>Plan development opportunities and resources</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("employee-management")}>
                      ← Previous: Managing Employees
                    </Button>
                    <Button onClick={() => handleTabChange("announcements-guide")}>
                      Next: Announcements →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements-guide">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-primary" />
                  <CardTitle>Announcements Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Communication Hub</h3>
                  <p>
                    The Announcements system keeps everyone informed about important company news, 
                    policy updates, events, and other organizational communications in one centralized location.
                  </p>

                  <h3 className="text-lg font-semibold">How to Access Announcements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Dashboard:</span> Recent announcements appear 
                      prominently on your dashboard homepage
                    </li>
                    <li>
                      <span className="font-medium">Announcements Page:</span> Click "Announcements" 
                      in the main navigation for the complete list
                    </li>
                    <li>
                      <span className="font-medium">Notifications:</span> High-priority announcements 
                      may trigger browser notifications
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold">Announcement Priority Levels</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Critical information requiring immediate attention - safety alerts, 
                        urgent policy changes, emergency notifications.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-amber-100 text-amber-800">Medium Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Important updates that affect daily work - new procedures, 
                        upcoming deadlines, training requirements.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-800">Low Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        General information and updates - company news, 
                        social events, non-urgent reminders.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Announcement Categories</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Policy Updates:</span> Changes to company 
                      policies, procedures, and guidelines
                    </div>
                    <div>
                      <span className="font-medium">Events:</span> Company meetings, training 
                      sessions, social events, and important dates
                    </div>
                    <div>
                      <span className="font-medium">General News:</span> Company achievements, 
                      employee recognition, industry updates
                    </div>
                    <div>
                      <span className="font-medium">System Updates:</span> Changes to HR 
                      systems, new features, maintenance notifications
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Reading and Managing Announcements</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Reading Status:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Unread announcements appear with bold titles</li>
                        <li>System tracks which announcements you've viewed</li>
                        <li>Mark as read automatically when you click to view details</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Search and Filter:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Search announcements by title or content keywords</li>
                        <li>Filter by priority level or category</li>
                        <li>Sort by date (newest first by default)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Archive Access:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Access historical announcements dating back months</li>
                        <li>Reference past policy changes and important decisions</li>
                        <li>Use for onboarding new team members</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Creating Announcements (Admin/Manager)</h3>
                  <p>If you have permission to create announcements:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Click "Create Announcement":</span> 
                      Access the announcement creation form
                    </li>
                    <li>
                      <span className="font-medium">Set Priority Level:</span> 
                      Choose appropriate priority based on urgency and importance
                    </li>
                    <li>
                      <span className="font-medium">Choose Category:</span> 
                      Select the most relevant category for organization
                    </li>
                    <li>
                      <span className="font-medium">Write Clear Content:</span> 
                      Use clear, concise language with actionable information
                    </li>
                    <li>
                      <span className="font-medium">Schedule Publication:</span> 
                      Publish immediately or schedule for future release
                    </li>
                  </ol>

                  <h3 className="text-lg font-semibold">Best Practices for Readers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Check announcements regularly, ideally daily</li>
                    <li>Pay special attention to high-priority notifications</li>
                    <li>Read full content, not just titles, for important updates</li>
                    <li>Ask questions if announcements are unclear</li>
                    <li>Share relevant information with team members when appropriate</li>
                  </ul>

                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-700 dark:text-amber-300">Stay Informed</p>
                        <p className="text-amber-600 dark:text-amber-400 text-sm">
                          Regular announcement reading is part of your professional responsibility. 
                          Important policy changes and company updates may affect your daily work 
                          and require immediate attention.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Mobile Access</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Full announcement functionality available on mobile devices</li>
                    <li>Push notifications for high-priority announcements</li>
                    <li>Offline reading capability for downloaded announcements</li>
                    <li>Easy sharing via mobile communication apps</li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("performance-reviews")}>
                      ← Previous: Performance Reviews
                    </Button>
                    <Button onClick={() => handleTabChange("profile-settings")}>
                      Next: Profile & Settings →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile-settings">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Pencil className="h-6 w-6 text-primary" />
                  <CardTitle>Profile & Settings Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Managing Your Profile</h3>
                  <p>
                    Your profile contains personal and professional information that's visible 
                    throughout the system. Keep it updated to ensure accurate communication 
                    and proper system functionality.
                  </p>

                  <h3 className="text-lg font-semibold">Accessing Your Profile</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Click Your Avatar:</span> 
                      Located in the top-right corner of any page
                    </li>
                    <li>
                      <span className="font-medium">Select "My Profile":</span> 
                      From the dropdown menu that appears
                    </li>
                    <li>
                      <span className="font-medium">View/Edit Information:</span> 
                      See your complete profile and make necessary updates
                    </li>
                  </ol>

                  <h3 className="text-lg font-semibold">Profile Information Sections</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Personal Information</h4>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Full name (first and last)</li>
                        <li>Profile picture/avatar</li>
                        <li>Personal email address</li>
                        <li>Phone number (primary and mobile)</li>
                        <li>Emergency contact information</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Professional Information</h4>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Job title/position</li>
                        <li>Department and team assignment</li>
                        <li>Start date and employment history</li>
                        <li>Reporting manager</li>
                        <li>Work location and office</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">System Settings</h4>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Login email and password</li>
                        <li>Notification preferences</li>
                        <li>Language and timezone settings</li>
                        <li>Privacy settings</li>
                        <li>Two-factor authentication (if available)</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Updating Your Profile Picture</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Navigate to your profile page</li>
                    <li>Click on your current profile picture or the camera icon</li>
                    <li>Select a new image from your device (recommended: square format, under 2MB)</li>
                    <li>Crop and adjust as needed</li>
                    <li>Save changes to update across the system</li>
                  </ol>

                  <h3 className="text-lg font-semibold">Profile Completion Checklist</h3>
                  <p>Ensure your profile is complete for the best experience:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Profile picture uploaded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Contact information current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Emergency contact provided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Job title and department accurate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Notification preferences set</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Privacy and Security</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Information Visibility:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Basic info (name, title, department) visible to all employees</li>
                        <li>Contact details visible to managers and HR</li>
                        <li>Personal information restricted to authorized personnel</li>
                        <li>You control profile picture visibility</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Password Security:</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Change your password regularly (every 90 days recommended)</li>
                        <li>Use a strong, unique password</li>
                        <li>Never share login credentials with others</li>
                        <li>Contact IT immediately if you suspect account compromise</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">Keep Information Current</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Outdated profile information can cause communication issues and may affect 
                          payroll, benefits, and emergency procedures. Update your profile immediately 
                          when personal details change.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Notification Settings</h3>
                  <p>Customize how you receive important updates:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Email Notifications:</span> 
                      Choose which events trigger email alerts
                    </li>
                    <li>
                      <span className="font-medium">Browser Notifications:</span> 
                      Enable/disable popup notifications for urgent items
                    </li>
                    <li>
                      <span className="font-medium">Frequency Settings:</span> 
                      Select immediate, daily digest, or weekly summary options
                    </li>
                    <li>
                      <span className="font-medium">Category Preferences:</span> 
                      Control notifications for absences, announcements, reviews, etc.
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold">Common Profile Issues</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Can't update certain fields?</span>
                      <p className="text-sm text-muted-foreground">
                        Some information (like department or role) may require manager or HR approval.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Profile picture won't upload?</span>
                      <p className="text-sm text-muted-foreground">
                        Ensure the image is under 2MB and in JPG, PNG, or GIF format.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Not receiving notifications?</span>
                      <p className="text-sm text-muted-foreground">
                        Check your notification settings and email spam folder.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("announcements-guide")}>
                      ← Previous: Announcements
                    </Button>
                    <Button onClick={() => handleTabChange("troubleshooting")}>
                      Next: Troubleshooting →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-primary" />
                  <CardTitle>Troubleshooting & Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Common Issues & Solutions</h3>
                  <p>
                    Most issues can be resolved quickly with these troubleshooting steps. 
                    If problems persist, contact your system administrator or IT support.
                  </p>

                  <h3 className="text-lg font-semibold">Login and Access Issues</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-red-500 pl-4">
                      <span className="font-medium">Can't log in / Forgot password</span>
                      <ol className="list-decimal pl-6 text-sm mt-1">
                        <li>Verify you're using the correct email address</li>
                        <li>Try resetting your password using the "Forgot Password" link</li>
                        <li>Check your email (including spam folder) for reset instructions</li>
                        <li>Contact your manager or IT if the reset email doesn't arrive</li>
                      </ol>
                    </div>
                    
                    <div className="border-l-4 border-amber-500 pl-4">
                      <span className="font-medium">Page won't load / Blank screen</span>
                      <ol className="list-decimal pl-6 text-sm mt-1">
                        <li>Refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Try a different browser (Chrome, Firefox, Safari, Edge)</li>
                        <li>Disable browser extensions temporarily</li>
                        <li>Check your internet connection</li>
                      </ol>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Time Clock Problems</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <span className="font-medium">Clock in/out button not working</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Ensure you're logged in properly</li>
                        <li>Check if there's an error message displayed</li>
                        <li>Try refreshing the page</li>
                        <li>Report multiple failed clock-ins to your manager immediately</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <span className="font-medium">Incorrect time entries</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Check your timezone settings in your profile</li>
                        <li>Document the correct times and notify your manager</li>
                        <li>Managers can manually adjust time entries if needed</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Absence Request Issues</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4">
                      <span className="font-medium">Request not submitted / Error submitting</span>
                      <ol className="list-decimal pl-6 text-sm mt-1">
                        <li>Verify all required fields are completed</li>
                        <li>Check that end date is after start date</li>
                        <li>Ensure you're not requesting retroactive time off (if restricted)</li>
                        <li>Try submitting again after a few minutes</li>
                      </ol>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <span className="font-medium">Manager can't approve/decline requests</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Verify manager has the correct permissions</li>
                        <li>Check if the request is still in "Pending" status</li>
                        <li>Try logging out and back in</li>
                        <li>Contact admin if approval buttons aren't visible</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Performance and Speed Issues</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <span className="font-medium">System is slow / Pages take long to load</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Check your internet connection speed</li>
                        <li>Close other browser tabs and applications</li>
                        <li>Clear browser cache and restart browser</li>
                        <li>Try using the system during off-peak hours</li>
                        <li>Report persistent slowness to IT</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Mobile Device Issues</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-orange-500 pl-4">
                      <span className="font-medium">Layout looks broken on mobile</span>
                      <ul className="list-disc pl-6 text-sm mt-1">
                        <li>Try rotating your device (portrait/landscape)</li>
                        <li>Refresh the page or restart your browser app</li>
                        <li>Update your mobile browser to the latest version</li>
                        <li>Try using the system on a desktop if urgent</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Data and Permissions Issues</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Can't see certain features or employees:</span>
                      <p className="text-sm text-muted-foreground">
                        This is usually normal - your access is based on your role. Contact your 
                        manager if you need different permissions.
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Information seems outdated:</span>
                      <ul className="list-disc pl-6 text-sm">
                        <li>Try refreshing the page to get latest data</li>
                        <li>Log out and log back in to reset your session</li>
                        <li>Contact admin if data should be different</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-300">When to Contact Support</p>
                        <p className="text-red-600 dark:text-red-400 text-sm">
                          Contact your system administrator immediately if: you suspect a security 
                          issue, multiple employees report the same problem, or critical functions 
                          (payroll, time tracking) are affected.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Getting Help</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">First Level Support:</span>
                      <p className="text-sm text-muted-foreground">
                        Your direct manager or team lead for work-related questions
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">IT Support:</span>
                      <p className="text-sm text-muted-foreground">
                        Technical issues, password resets, system access problems
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">HR Administrator:</span>
                      <p className="text-sm text-muted-foreground">
                        Profile updates, permission changes, policy questions
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Information to Include When Reporting Issues</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Exact error message (screenshot if possible)</li>
                    <li>What you were trying to do when the problem occurred</li>
                    <li>Your browser and operating system</li>
                    <li>Whether the problem happens consistently or intermittently</li>
                    <li>If other users are experiencing the same issue</li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("profile-settings")}>
                      ← Previous: Profile & Settings
                    </Button>
                    <Button onClick={() => handleTabChange("getting-started")}>
                      Back to Getting Started →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
