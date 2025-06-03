import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPerformanceData } from "@/services/performanceService";
import { getCurrentUser } from "@/services/authService";
import { hasPermission } from "@/services/permissionService";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Performance = () => {
  const isMobile = useIsMobile();
  const currentUser = getCurrentUser();
  const canViewTeamPerformance = hasPermission('performance', 'read', 'department');

  // Mock data for demonstration
  const employeeGoals = [
    { id: 1, name: "Increase Sales", progress: 75, target: 100, status: "In Progress" },
    { id: 2, name: "Improve Customer Satisfaction", progress: 90, target: 100, status: "Completed" },
    { id: 3, name: "Launch New Product", progress: 40, target: 100, status: "In Progress" },
  ];

  const employeeReviews = [
    { id: 1, date: "2024-01-15", reviewer: "John Doe", rating: 4.5, comments: "Excellent performance overall." },
    { id: 2, date: "2023-07-20", reviewer: "Jane Smith", rating: 4.0, comments: "Good progress, needs improvement in some areas." },
  ];

  const teamPerformanceData = [
    { name: 'Jan', sales: 2400, customers: 4567 },
    { name: 'Feb', sales: 1398, customers: 1110 },
    { name: 'Mar', sales: 9800, customers: 3456 },
    { name: 'Apr', sales: 3908, customers: 2345 },
    { name: 'May', sales: 4800, customers: 6789 },
    { name: 'Jun', sales: 3800, customers: 4567 },
    { name: 'Jul', sales: 4300, customers: 3456 },
    { name: 'Aug', sales: 2400, customers: 1234 },
    { name: 'Sep', sales: 1398, customers: 5678 },
    { name: 'Oct', sales: 9800, customers: 4321 },
    { name: 'Nov', sales: 3908, customers: 5678 },
    { name: 'Dec', sales: 4800, customers: 2345 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Fetch performance data (only for users with permission)
  const { data: performanceData } = useQuery({
    queryKey: ['performance', currentUser?.id],
    queryFn: () => getPerformanceData(currentUser?.id),
    enabled: canViewTeamPerformance,
  });

  return (
    <div className="page-container pb-16">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Sales Performance</CardTitle>
                <CardDescription>Monthly sales trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={teamPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Customer Acquisition</CardTitle>
                <CardDescription>New customers per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={teamPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="customers" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Employee Satisfaction</CardTitle>
                <CardDescription>Overall employee satisfaction rate</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[{ name: 'Satisfied', value: 75 }, { name: 'Neutral', value: 15 }, { name: 'Dissatisfied', value: 10 }]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[{ name: 'Satisfied', value: 75 }, { name: 'Neutral', value: 15 }, { name: 'Dissatisfied', value: 10 }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Goals</CardTitle>
              <CardDescription>Track progress on key employee objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold">{goal.name}</div>
                      <Badge variant="secondary">{goal.status}</Badge>
                    </div>
                    <Progress value={goal.progress} />
                    <div className="text-sm text-muted-foreground">
                      {goal.progress}% Complete
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Past performance review records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeReviews.map((review) => (
                  <div key={review.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Review Date: {review.date}</div>
                      <Badge variant="outline">Rating: {review.rating}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reviewer: {review.reviewer}
                    </div>
                    <div className="text-sm mt-2">
                      Comments: {review.comments}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
