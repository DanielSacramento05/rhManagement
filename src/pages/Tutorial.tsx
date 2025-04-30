
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Tutorial() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">HR Management System Tutorial</h1>
          <p className="text-muted-foreground">
            Learn how to use the HR Management System effectively
          </p>
        </div>
        
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="absences">Absences</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the HR Management System</CardTitle>
                <CardDescription>
                  This tutorial will guide you through the basic features of the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">System Overview</h3>
                  <p>The HR Management System allows you to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Manage employee records and information</li>
                    <li>Track and approve employee absences and time off</li>
                    <li>Monitor and record employee performance</li>
                    <li>View department information and organization structure</li>
                    <li>Generate reports and analytics on HR metrics</li>
                  </ul>
                </section>
                
                <Separator />
                
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Getting Started</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Account Creation</h4>
                      <p className="text-sm text-muted-foreground">
                        To use the system, you need an account. If you don't have one,
                        contact your HR administrator or register using the registration form.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Logging In</h4>
                      <p className="text-sm text-muted-foreground">
                        Use your email and password to log into the system. After logging in,
                        you'll be directed to the dashboard.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. User Roles</h4>
                      <p className="text-sm text-muted-foreground">
                        The system has three main user roles:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground mt-1">
                        <li><strong>Admin:</strong> Full access to all system features</li>
                        <li><strong>Manager:</strong> Can manage team members, approve absences, and conduct performance reviews</li>
                        <li><strong>Employee:</strong> Can view own information, request absences, and see performance reviews</li>
                      </ul>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Navigation</h3>
                  <p className="text-sm text-muted-foreground">
                    The main navigation bar at the top of the screen allows you to access different sections of the system:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Dashboard:</strong> Overview of key metrics and recent activities</li>
                    <li><strong>Employees:</strong> Manage employee information</li>
                    <li><strong>Absences:</strong> Manage time off requests</li>
                    <li><strong>Performance:</strong> Track employee performance metrics</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  The dashboard provides an overview of key HR metrics and recent activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Dashboard Components</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Key Metrics Cards</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows important numbers at a glance, including total employees,
                        departments, employees on leave, and upcoming reviews.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Recent Activities</h4>
                      <p className="text-sm text-muted-foreground">
                        Displays recent system activities like new hires, status changes,
                        and absence requests that need attention.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Analytics Graphs</h4>
                      <p className="text-sm text-muted-foreground">
                        Visual representations of important HR data, such as department
                        distribution and absence trends.
                      </p>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Actions</h3>
                  <p className="text-sm text-muted-foreground">
                    From the dashboard, you can:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Click on key metrics to see more detailed information</li>
                    <li>Access quick links to commonly used functions</li>
                    <li>View and respond to pending notifications</li>
                    <li>Filter dashboard data based on departments or time periods</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employees" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Managing Employees</CardTitle>
                <CardDescription>
                  Learn how to add, view, and modify employee information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Employee Management Features</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Employee Directory</h4>
                      <p className="text-sm text-muted-foreground">
                        View all employees in a list or grid format. Use filters to find specific employees
                        based on department, status, or other criteria.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Adding New Employees</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the "Add Employee" button to open the form. Fill in required information
                        like name, email, department, and position, then submit.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Required fields include: Name, Email, Position, Department, and Phone
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Editing Employee Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Click on an employee card or the "Edit" button to modify their information.
                        Make changes in the form and save.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">4. Employee Status Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Change an employee's status to Active, Remote, or On-Leave as needed.
                        Status changes are logged and visible in the employee history.
                      </p>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Employee Details</h3>
                  <p className="text-sm text-muted-foreground">
                    When viewing an employee's details, you can see:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Personal information and contact details</li>
                    <li>Employment history and position information</li>
                    <li>Absence records and upcoming time off</li>
                    <li>Performance reviews and goals</li>
                    <li>Skills and qualifications</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="absences" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Managing Absences</CardTitle>
                <CardDescription>
                  Learn how to request and manage time off
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Absence Management Features</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Requesting Time Off</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the "Request Time Off" button to open the form. Select the type of absence,
                        dates, and provide any necessary notes.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Absence types include: Vacation, Sick Leave, Personal, and Training
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Viewing Absence Requests</h4>
                      <p className="text-sm text-muted-foreground">
                        All absence requests are listed with their status (pending, approved, or declined).
                        Managers can see requests from their team members that need approval.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Approving or Declining Requests</h4>
                      <p className="text-sm text-muted-foreground">
                        Managers can review pending requests and approve or decline them.
                        They can also add comments explaining their decision.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">4. Absence Calendar</h4>
                      <p className="text-sm text-muted-foreground">
                        View a calendar showing all absences across the team or department.
                        This helps with planning and avoiding conflicting absences.
                      </p>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Absence Types</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li><strong>Vacation:</strong> Planned time off for personal leisure</li>
                    <li><strong>Sick Leave:</strong> Time off due to illness or medical appointments</li>
                    <li><strong>Personal:</strong> Time off for personal matters</li>
                    <li><strong>Training:</strong> Time spent in professional development or training programs</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Management</CardTitle>
                <CardDescription>
                  Learn how to track and evaluate employee performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Performance Management Features</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Performance Reviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Managers can create and conduct regular performance reviews.
                        Reviews can be quarterly, semi-annual, or annual.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">2. Setting Goals</h4>
                      <p className="text-sm text-muted-foreground">
                        Create performance goals for employees with specific metrics,
                        deadlines, and expected outcomes.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">3. Skill Assessments</h4>
                      <p className="text-sm text-muted-foreground">
                        Evaluate and track employee skills and competencies.
                        Identify areas for improvement and development.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">4. Performance Metrics</h4>
                      <p className="text-sm text-muted-foreground">
                        View performance trends over time and compare across teams
                        or departments using visual analytics.
                      </p>
                    </div>
                  </div>
                </section>
                
                <Separator />
                
                <section className="space-y-2">
                  <h3 className="text-lg font-medium">Conducting a Performance Review</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
                    <li>Navigate to the Performance section</li>
                    <li>Click "New Review" and select the employee</li>
                    <li>Choose the review type (Quarterly, Semi-Annual, Annual)</li>
                    <li>Complete each section of the review form</li>
                    <li>Provide an overall score and detailed feedback</li>
                    <li>Set goals for the next review period</li>
                    <li>Submit and schedule a feedback session with the employee</li>
                  </ol>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Contact information and additional resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you need further assistance using the HR Management System, please contact:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>HR Support Team: <strong>hr-support@example.com</strong></li>
              <li>System Administrator: <strong>admin@example.com</strong></li>
              <li>Phone Support: <strong>(555) 123-4567</strong></li>
            </ul>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button asChild>
                <Link to="/">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
