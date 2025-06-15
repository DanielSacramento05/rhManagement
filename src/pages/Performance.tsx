
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Award, Calendar, Star, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPerformanceReviews, getPerformanceGoals, getSkillAssessments } from "@/services/performanceService";
import { getCurrentUser } from "@/services/authService";
import { hasPermission } from "@/services/permissionService";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";

const Performance = () => {
  const isMobile = useIsMobile();
  const currentUser = getCurrentUser();
  const canViewTeamPerformance = hasPermission('performance', 'read', 'department');

  // Fetch user's performance reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['performance-reviews', currentUser?.id],
    queryFn: () => getPerformanceReviews({ employeeId: currentUser?.id }),
    enabled: !!currentUser?.id,
  });

  // Fetch user's performance goals
  const { data: goalsData, isLoading: goalsLoading } = useQuery({
    queryKey: ['performance-goals', currentUser?.id],
    queryFn: () => getPerformanceGoals(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  // Fetch user's skill assessments
  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ['skill-assessments', currentUser?.id],
    queryFn: () => getSkillAssessments(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  const reviews = reviewsData?.data || [];
  const goals = goalsData?.data || [];
  const skills = skillsData?.data || [];

  // Calculate stats
  const averageReviewScore = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.overallScore, 0) / reviews.length 
    : 0;

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const inProgressGoals = goals.filter(goal => goal.status === 'in-progress').length;
  const notStartedGoals = goals.filter(goal => goal.status === 'not-started').length;

  const averageSkillScore = skills.length > 0
    ? skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length
    : 0;

  // Prepare chart data for skills
  const skillsChartData = skills.map(skill => ({
    name: skill.name,
    score: skill.score,
  }));

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 4.0) return "default";
    if (score >= 3.0) return "secondary";
    return "destructive";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return "default";
      case 'in-progress':
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="page-container pb-16">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Average Review Score</p>
                <p className="text-2xl font-bold">{averageReviewScore.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed Goals</p>
                <p className="text-2xl font-bold">{completedGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Skill Score</p>
                <p className="text-2xl font-bold">{averageSkillScore.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Your performance review history and scores</CardDescription>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="text-center py-8">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No performance reviews found
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-lg font-semibold">{review.reviewType} Review</div>
                        <Badge variant={getScoreBadgeVariant(review.overallScore)}>
                          Score: {review.overallScore.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Review Date: {format(new Date(review.reviewDate), 'MMM dd, yyyy')}
                      </div>
                      {review.notes && (
                        <div className="text-sm mt-2">
                          <strong>Notes:</strong> {review.notes}
                        </div>
                      )}
                      {review.nextReviewDate && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Next Review: {format(new Date(review.nextReviewDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{inProgressGoals}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Not Started</p>
                    <p className="text-2xl font-bold text-gray-600">{notStartedGoals}</p>
                  </div>
                  <Target className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>Track progress on your performance objectives</CardDescription>
            </CardHeader>
            <CardContent>
              {goalsLoading ? (
                <div className="text-center py-8">Loading goals...</div>
              ) : goals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No performance goals found
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">{goal.title}</div>
                        <Badge variant={getStatusBadgeVariant(goal.status)}>
                          {goal.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      {goal.description && (
                        <div className="text-sm text-muted-foreground">
                          {goal.description}
                        </div>
                      )}
                      <Progress value={goal.progress} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{goal.progress}% Complete</span>
                        {goal.dueDate && (
                          <span>Due: {format(new Date(goal.dueDate), 'MMM dd, yyyy')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessments</CardTitle>
                <CardDescription>Your current skill ratings and areas for development</CardDescription>
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="text-center py-8">Loading skills...</div>
                ) : skills.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No skill assessments found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{skill.name}</div>
                          <div className="text-sm font-bold">{skill.score}%</div>
                        </div>
                        <Progress value={skill.score} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills Overview</CardTitle>
                  <CardDescription>Visual representation of your skill scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
