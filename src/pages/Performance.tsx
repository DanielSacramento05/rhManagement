
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardCard } from "@/components/DashboardCard";
import { 
  ClipboardList, 
  LineChart, 
  Star, 
  Calendar, 
  Award,
  TrendingUp,
  UserCheck,
  Users,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Mock data
const performanceData = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Emily Johnson",
    department: "Design",
    position: "Senior UX Designer",
    overallScore: 92,
    lastReviewDate: "2023-06-15",
    nextReviewDate: "2023-12-15",
    goals: [
      { id: "g1", title: "Complete design system", progress: 75, status: "in-progress" },
      { id: "g2", title: "User research for mobile app", progress: 100, status: "completed" },
    ],
    skills: [
      { name: "UI Design", score: 95 },
      { name: "User Research", score: 90 },
      { name: "Prototyping", score: 85 },
      { name: "Team Collaboration", score: 92 },
    ],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Michael Rodriguez",
    department: "Engineering",
    position: "Software Engineer",
    overallScore: 88,
    lastReviewDate: "2023-05-20",
    nextReviewDate: "2023-11-20",
    goals: [
      { id: "g3", title: "API optimization", progress: 80, status: "in-progress" },
      { id: "g4", title: "Code refactoring", progress: 60, status: "in-progress" },
      { id: "g5", title: "Documentation", progress: 30, status: "in-progress" },
    ],
    skills: [
      { name: "JavaScript", score: 90 },
      { name: "React", score: 85 },
      { name: "Node.js", score: 80 },
      { name: "Problem Solving", score: 92 },
    ],
    imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "Jessica Chen",
    department: "Product",
    position: "Product Manager",
    overallScore: 95,
    lastReviewDate: "2023-07-05",
    nextReviewDate: "2024-01-05",
    goals: [
      { id: "g6", title: "Product roadmap", progress: 100, status: "completed" },
      { id: "g7", title: "Market analysis", progress: 90, status: "in-progress" },
      { id: "g8", title: "Feature prioritization", progress: 85, status: "in-progress" },
    ],
    skills: [
      { name: "Strategic Planning", score: 95 },
      { name: "Stakeholder Management", score: 92 },
      { name: "Market Research", score: 88 },
      { name: "Agile Methodologies", score: 90 },
    ],
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

const upcomingReviews = [
  {
    id: "1",
    employeeId: "4",
    employeeName: "David Wilson",
    department: "Marketing",
    position: "Marketing Director",
    reviewDate: "2023-09-10",
    reviewType: "Quarterly",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "2",
    employeeId: "5",
    employeeName: "Sophia Martinez",
    department: "Human Resources",
    position: "HR Specialist",
    reviewDate: "2023-09-15",
    reviewType: "Semi-Annual",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "3",
    employeeId: "6",
    employeeName: "Andrew Taylor",
    department: "Finance",
    position: "Financial Analyst",
    reviewDate: "2023-09-22",
    reviewType: "Quarterly",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

const Performance = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>("1"); // Default expanded

  const toggleExpand = (id: string) => {
    setExpandedEmployee(expandedEmployee === id ? null : id);
  };

  // Filter employees based on department
  const filteredPerformance = performanceData.filter((employee) => {
    return !selectedDepartment || employee.department === selectedDepartment;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 75) return "bg-amber-100";
    return "bg-red-100";
  };

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">In Progress</Badge>;
      case "not-started":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="page-container pb-16">
      <div className="animate-in">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Performance</h1>
        <p className="text-muted-foreground mb-8">
          Track and manage employee performance reviews and goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in">
        <DashboardCard
          title="Average Performance"
          value="88%"
          icon={<Star className="h-5 w-5" />}
          trend={{ value: 2.5, isPositive: true }}
          footer={<span className="text-muted-foreground">Across all departments</span>}
        />

        <DashboardCard
          title="Upcoming Reviews"
          value={upcomingReviews.length.toString()}
          icon={<Calendar className="h-5 w-5" />}
          footer={<span className="text-muted-foreground">In the next 30 days</span>}
        />

        <DashboardCard
          title="Completed Goals"
          value="24"
          icon={<Award className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          footer={<span className="text-muted-foreground">This quarter</span>}
        />
      </div>

      <div className="mb-8 animate-in">
        <Tabs defaultValue="employee-reviews">
          <TabsList>
            <TabsTrigger value="employee-reviews">Employee Reviews</TabsTrigger>
            <TabsTrigger value="upcoming-reviews">Upcoming Reviews</TabsTrigger>
            <TabsTrigger value="department-analytics">Department Analytics</TabsTrigger>
          </TabsList>

          <div className="mt-6 mb-4">
            <Select onValueChange={setSelectedDepartment} value={selectedDepartment || ""}>
              <SelectTrigger className="w-[220px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="employee-reviews" className="mt-0">
            <div className="space-y-4">
              {filteredPerformance.map((employee) => (
                <Card key={employee.id} className="overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpand(employee.id)}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <img
                          src={employee.imageUrl}
                          alt={employee.employeeName}
                          className="object-cover"
                        />
                      </Avatar>

                      <div className="sm:flex-1 text-center sm:text-left">
                        <h3 className="font-medium text-lg">{employee.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {employee.position} • {employee.department}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm">
                            Last Review: <span className="font-medium">{format(parseISO(employee.lastReviewDate), "MMM d, yyyy")}</span>
                          </p>
                          <p className="text-sm">
                            Next Review: <span className="font-medium">{format(parseISO(employee.nextReviewDate), "MMM d, yyyy")}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreBackground(employee.overallScore)}`}>
                          <span className={`text-2xl font-bold ${getScoreColor(employee.overallScore)}`}>
                            {employee.overallScore}
                          </span>
                        </div>
                        <p className="text-xs mt-1 text-muted-foreground">Overall Score</p>
                      </div>

                      <div className="self-center">
                        {expandedEmployee === employee.id ? (
                          <ChevronDown className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedEmployee === employee.id && (
                    <>
                      <div className="px-6 py-4 bg-muted/30">
                        <h4 className="font-medium mb-4 flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                          Performance Goals
                        </h4>

                        <div className="space-y-4">
                          {employee.goals.map((goal) => (
                            <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium">{goal.title}</h5>
                                {getGoalStatusBadge(goal.status)}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{goal.progress}%</span>
                                </div>
                                <Progress value={goal.progress} className="h-2" />
                              </div>
                            </div>
                          ))}
                        </div>

                        <h4 className="font-medium mt-6 mb-4 flex items-center">
                          <LineChart className="h-4 w-4 mr-2 text-primary" />
                          Skills Assessment
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {employee.skills.map((skill) => (
                            <div key={skill.name} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{skill.name}</span>
                                  <span className={getScoreColor(skill.score)}>{skill.score}/100</span>
                                </div>
                                <Progress value={skill.score} className="h-2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-muted/50 px-6 py-3 flex justify-end space-x-2">
                        <Button variant="outline">Add Note</Button>
                        <Button>Schedule Review</Button>
                      </div>
                    </>
                  )}
                </Card>
              ))}

              {filteredPerformance.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No employees found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedDepartment(null)}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming-reviews" className="mt-0">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Scheduled Performance Reviews
                </h3>

                <div className="divide-y">
                  {upcomingReviews.map((review) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <img
                            src={review.imageUrl}
                            alt={review.employeeName}
                            className="object-cover"
                          />
                        </Avatar>

                        <div className="flex-1">
                          <h4 className="font-medium">{review.employeeName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {review.position} • {review.department}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-medium">
                            {format(parseISO(review.reviewDate), "MMM d, yyyy")}
                          </p>
                          <Badge className="mt-1">{review.reviewType}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button>Schedule New Review</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="department-analytics" className="mt-0">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Department Performance Overview
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Engineering</span>
                      <span className="text-green-600 font-medium">87</span>
                    </div>
                    <Progress value={87} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Design</span>
                      <span className="text-green-600 font-medium">92</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Product</span>
                      <span className="text-green-600 font-medium">94</span>
                    </div>
                    <Progress value={94} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Marketing</span>
                      <span className="text-amber-600 font-medium">82</span>
                    </div>
                    <Progress value={82} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Human Resources</span>
                      <span className="text-green-600 font-medium">89</span>
                    </div>
                    <Progress value={89} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Finance</span>
                      <span className="text-green-600 font-medium">85</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Performance Insights</h4>
                    <p className="text-sm text-amber-700">
                      The Marketing department has seen a 3% decline in performance scores compared to the previous quarter. Consider scheduling additional team discussions to identify challenges.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Performance;
