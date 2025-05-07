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
  HelpCircle
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
                App Tutorial
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
                    value="registration"
                    className="justify-start"
                    onClick={() => handleTabChange("registration")}
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Registration & Login</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="dashboard"
                    className="justify-start"
                    onClick={() => handleTabChange("dashboard")}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="employees"
                    className="justify-start"
                    onClick={() => handleTabChange("employees")}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Managing Employees</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="absences"
                    className="justify-start"
                    onClick={() => handleTabChange("absences")}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Absences</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="performance"
                    className="justify-start"
                    onClick={() => handleTabChange("performance")}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>Performance Reviews</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="justify-start"
                    onClick={() => handleTabChange("profile")}
                  >
                    <div className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      <span>User Profile</span>
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
                  <CardTitle>Getting Started with HR Management App</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Welcome to the HR Management System</h3>
                  <p>
                    This application helps organizations manage their employees, track absences, and conduct performance reviews.
                    It provides a comprehensive suite of tools for human resource management tasks.
                  </p>
                  <div className="bg-muted p-4 rounded-md flex items-start gap-3 mt-4">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Getting help</p>
                      <p className="text-muted-foreground text-sm">
                        If you need assistance at any point while using this application, 
                        refer to this tutorial or contact system administration.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold pt-4">Core Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Employee Management</span>
                      <p className="text-muted-foreground">View and manage employee information, add new employees, and deactivate former employees.</p>
                    </li>
                    <li>
                      <span className="font-medium">Absence Tracking</span>
                      <p className="text-muted-foreground">Review and manage employee time off requests, vacations, and sick leave.</p>
                    </li>
                    <li>
                      <span className="font-medium">Performance Reviews</span>
                      <p className="text-muted-foreground">Conduct and track employee performance reviews and goal-setting.</p>
                    </li>
                    <li>
                      <span className="font-medium">User Profiles</span>
                      <p className="text-muted-foreground">Manage your own profile information and account settings.</p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">User Roles</h3>
                  <p>The system supports different user roles with varying permissions:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Admin</span>
                      <p className="text-muted-foreground">Full system access including employee management, department configuration, and system settings.</p>
                    </li>
                    <li>
                      <span className="font-medium">Manager</span>
                      <p className="text-muted-foreground">Can manage team members, approve absences, and conduct performance reviews.</p>
                    </li>
                    <li>
                      <span className="font-medium">Employee</span>
                      <p className="text-muted-foreground">Can view their own information, request time off, and participate in performance reviews.</p>
                    </li>
                  </ul>

                  <div className="pt-4">
                    <Button onClick={() => handleTabChange("registration")}>
                      Next: Registration & Login
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                  <CardTitle>Registration & Login</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Creating an Account</h3>
                  <p>
                    To use the HR Management System, you'll need to create an account 
                    or use credentials provided by your administrator.
                  </p>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Navigate to the login page</span>
                      <p className="text-muted-foreground">Click the "Login" button in the top navigation or go to the login URL directly.</p>
                    </li>
                    <li>
                      <span className="font-medium">Switch to registration</span>
                      <p className="text-muted-foreground">Click the "Register" tab at the top of the login form.</p>
                    </li>
                    <li>
                      <span className="font-medium">Fill out the registration form</span>
                      <p className="text-muted-foreground">
                        Enter your:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Full name</li>
                          <li>Email address (this will be your username)</li>
                          <li>Phone number (optional)</li>
                          <li>Password (minimum 6 characters)</li>
                          <li>Confirm your password</li>
                        </ul>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Complete profile setup</span>
                      <p className="text-muted-foreground">
                        After registration, you'll be prompted to complete your profile by adding:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Your position/job title</li>
                          <li>Department</li>
                          <li>Additional contact information</li>
                        </ul>
                      </p>
                    </li>
                  </ol>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md mt-4">
                    <p className="font-medium text-blue-700 dark:text-blue-300">Demo Accounts</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                      For demonstration purposes, you can use these accounts:
                    </p>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <Badge variant="outline" className="w-fit">Admin</Badge>
                        <span>Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin@example.com</code></span>
                        <span>Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin123</code></span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <Badge variant="outline" className="w-fit">Manager</Badge>
                        <span>Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">manager1@example.com</code></span>
                        <span>Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">manager123</code></span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <Badge variant="outline" className="w-fit">Employee</Badge>
                        <span>Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">employee1@example.com</code></span>
                        <span>Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">employee123</code></span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold pt-4">Logging In</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Navigate to the login page</span>
                      <p className="text-muted-foreground">Access the login page via the main navigation.</p>
                    </li>
                    <li>
                      <span className="font-medium">Enter your credentials</span>
                      <p className="text-muted-foreground">
                        Enter your registered email address and password.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Access the dashboard</span>
                      <p className="text-muted-foreground">
                        After successful login, you'll be redirected to the main dashboard.
                      </p>
                    </li>
                  </ol>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("getting-started")}>
                      Previous: Getting Started
                    </Button>
                    <Button onClick={() => handleTabChange("dashboard")}>
                      Next: Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-primary" />
                  <CardTitle>Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                  <p>
                    The dashboard is your central hub for accessing key information and 
                    navigating to different sections of the application.
                  </p>
                  
                  <h3 className="text-lg font-semibold">Key Components</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Navigation bar</span>
                      <p className="text-muted-foreground">
                        Located at the top of the screen, the navigation bar provides access to the main sections:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Dashboard (home)</li>
                          <li>Employees</li>
                          <li>Absences</li>
                          <li>Performance</li>
                        </ul>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Profile menu</span>
                      <p className="text-muted-foreground">
                        Access your profile and logout options from the avatar icon in the top right corner.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Summary cards</span>
                      <p className="text-muted-foreground">
                        Quick overview cards showing key metrics:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Total employees</li>
                          <li>Recent absences</li>
                          <li>Upcoming reviews</li>
                          <li>Department distribution</li>
                        </ul>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Quick actions</span>
                      <p className="text-muted-foreground">
                        Buttons to perform common tasks like adding employees or requesting time off.
                      </p>
                    </li>
                  </ul>
                  
                  <div className="bg-muted p-4 rounded-md flex items-start gap-3 mt-4">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">User-specific data</p>
                      <p className="text-muted-foreground text-sm">
                        The dashboard displays different information based on your user role 
                        (Admin, Manager, or Employee).
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("registration")}>
                      Previous: Registration & Login
                    </Button>
                    <Button onClick={() => handleTabChange("employees")}>
                      Next: Managing Employees
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle>Managing Employees</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Employee Management</h3>
                  <p>
                    The Employees section allows you to view, search, filter, and manage employee records.
                  </p>
                  
                  <h3 className="text-lg font-semibold">Features</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Employee listing</span>
                      <p className="text-muted-foreground">
                        View all employees in your organization with key information displayed on cards.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Status filters</span>
                      <p className="text-muted-foreground">
                        Filter employees by status:
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Office</Badge>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Remote</Badge>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">On Leave</Badge>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>
                        </div>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Search and filter</span>
                      <p className="text-muted-foreground">
                        Search for employees by name, email, or position. Filter by department or status.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Employee details</span>
                      <p className="text-muted-foreground">
                        Click "View Profile" on any employee card to see detailed information.
                      </p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">Admin Functions</h3>
                  <p>Administrators have access to additional employee management features:</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Add new employees</span>
                      <p className="text-muted-foreground">
                        Create new employee records by clicking the "Add Employee" button.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Update employee status</span>
                      <p className="text-muted-foreground">
                        Change an employee's status (In Office, Remote, On Leave, Inactive) from their profile view.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Deactivate employees</span>
                      <p className="text-muted-foreground">
                        Deactivate employees who have left the company (preferable to deletion to maintain records).
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Reactivate employees</span>
                      <p className="text-muted-foreground">
                        Reactivate previously deactivated employees who have returned to the company.
                      </p>
                    </li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("dashboard")}>
                      Previous: Dashboard
                    </Button>
                    <Button onClick={() => handleTabChange("absences")}>
                      Next: Absences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="absences">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <CardTitle>Absences Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Managing Time Off and Absences</h3>
                  <p>
                    The Absences section allows employees to request time off and for managers to approve or decline those requests.
                  </p>
                  
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Absence calendar</span>
                      <p className="text-muted-foreground">
                        Visual calendar showing all approved absences across the organization.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Request types</span>
                      <p className="text-muted-foreground">
                        Request different types of absences:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Vacation</li>
                          <li>Sick Leave</li>
                          <li>Personal</li>
                          <li>Training</li>
                        </ul>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Request status</span>
                      <p className="text-muted-foreground">
                        Track the status of absence requests:
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pending</Badge>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Declined</Badge>
                        </div>
                      </p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">Employee Functions</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Request time off</span>
                      <p className="text-muted-foreground">
                        Submit new absence requests by clicking the "Request Time Off" button.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">View request history</span>
                      <p className="text-muted-foreground">
                        See all your past and upcoming absences along with their approval status.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Cancel requests</span>
                      <p className="text-muted-foreground">
                        Cancel pending requests that haven't been approved yet.
                      </p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">Manager/Admin Functions</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Review requests</span>
                      <p className="text-muted-foreground">
                        Review all pending absence requests from team members.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Approve/decline</span>
                      <p className="text-muted-foreground">
                        Approve or decline requests with optional feedback.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Absence reporting</span>
                      <p className="text-muted-foreground">
                        View absence reports and trends across the organization.
                      </p>
                    </li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("employees")}>
                      Previous: Managing Employees
                    </Button>
                    <Button onClick={() => handleTabChange("performance")}>
                      Next: Performance Reviews
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  <CardTitle>Performance Reviews</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Management</h3>
                  <p>
                    The Performance section allows managers to conduct reviews, set goals, 
                    and track employee performance over time.
                  </p>
                  
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Performance reviews</span>
                      <p className="text-muted-foreground">
                        Schedule and conduct regular performance assessments:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Quarterly reviews</li>
                          <li>Semi-annual reviews</li>
                          <li>Annual reviews</li>
                        </ul>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Goal setting</span>
                      <p className="text-muted-foreground">
                        Set and track performance goals for employees with progress tracking.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Skill assessments</span>
                      <p className="text-muted-foreground">
                        Evaluate and track employee skills and competencies over time.
                      </p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">Employee Functions</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">View reviews</span>
                      <p className="text-muted-foreground">
                        Access your performance review history and feedback.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Track goals</span>
                      <p className="text-muted-foreground">
                        See your assigned performance goals and update progress.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Self-assessment</span>
                      <p className="text-muted-foreground">
                        Complete self-assessments before scheduled reviews.
                      </p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">Manager/Admin Functions</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Schedule reviews</span>
                      <p className="text-muted-foreground">
                        Create and schedule performance reviews for team members.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Conduct assessments</span>
                      <p className="text-muted-foreground">
                        Complete performance evaluations with ratings and feedback.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Assign goals</span>
                      <p className="text-muted-foreground">
                        Set performance goals for employees with timelines and metrics.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Performance analytics</span>
                      <p className="text-muted-foreground">
                        View performance trends and analytics across the team or organization.
                      </p>
                    </li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("absences")}>
                      Previous: Absences
                    </Button>
                    <Button onClick={() => handleTabChange("profile")}>
                      Next: User Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Pencil className="h-6 w-6 text-primary" />
                  <CardTitle>User Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Managing Your Profile</h3>
                  <p>
                    The Profile section allows you to view and update your personal information and account settings.
                  </p>
                  
                  <h3 className="text-lg font-semibold">Profile Features</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-medium">Personal information</span>
                      <p className="text-muted-foreground">
                        View and edit your personal details:
                        <ul className="list-disc pl-6 mt-2">
                          <li>Full name</li>
                          <li>Email address</li>
                          <li>Phone number</li>
                          <li>Position/title</li>
                          <li>Department</li>
                        </ul>
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Profile picture</span>
                      <p className="text-muted-foreground">
                        Update your profile picture that appears across the system.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Access your profile</span>
                      <p className="text-muted-foreground">
                        Access your profile by clicking your avatar in the top right corner and selecting "My Profile."
                      </p>
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold pt-4">Profile Completion</h3>
                  <p>
                    When registering for the first time, you'll be guided through profile completion to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Set your position/job title</li>
                    <li>Select your department</li>
                    <li>Add contact information</li>
                  </ul>
                  <p className="mt-2">
                    This information helps categorize and organize employees within the system.
                  </p>
                  
                  <h3 className="text-lg font-semibold pt-4">Account Security</h3>
                  <p>
                    While editing your profile information, remember:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Email addresses must be unique within the system</li>
                    <li>Your permissions are determined by your assigned role</li>
                    <li>Contact your administrator if you need role changes or special permissions</li>
                  </ul>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={() => handleTabChange("performance")}>
                      Previous: Performance Reviews
                    </Button>
                    <Button onClick={() => handleTabChange("getting-started")}>
                      Back to Getting Started
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
