
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestTimeOffForm } from "@/components/absences/RequestTimeOffForm";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAbsences } from "@/services/absenceService";
import { format, parseISO } from "date-fns";
import { getCurrentUser } from "@/services/authService";
import { hasPermission } from "@/services/permissionService";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Absences = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const isMobile = useIsMobile();
  
  const currentUser = getCurrentUser();
  const canViewAllAbsences = hasPermission('absences', 'read', 'department');
  const isEmployee = currentUser?.role === 'employee';

  // Fetch user's own absences
  const { data: userAbsences, isLoading: userAbsencesLoading } = useQuery({
    queryKey: ['absences', currentUser?.id],
    queryFn: () => getAbsences({ employeeId: currentUser?.id }),
  });

  // Fetch team absences if user has permission
  const { data: teamAbsences, isLoading: teamAbsencesLoading } = useQuery({
    queryKey: ['team-absences'],
    queryFn: () => getAbsences({ department: currentUser?.departmentName }),
    enabled: canViewAllAbsences,
  });

  // Filter absences based on status
  const filterAbsencesByStatus = (absences: any[] = []) => {
    if (statusFilter === 'all') return absences;
    return absences.filter(absence => absence.status === statusFilter);
  };

  const filteredUserAbsences = filterAbsencesByStatus(userAbsences?.data || []);
  const filteredTeamAbsences = filterAbsencesByStatus(teamAbsences?.data || []);

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Declined</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Render absence cards
  const renderAbsenceCards = (absences: any[], isLoading: boolean, emptyMessage: string) => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Loading absence requests...
          </CardContent>
        </Card>
      );
    }

    if (absences.length > 0) {
      return absences.map((absence) => (
        <Card key={absence.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {!isEmployee && absence.employeeName ? absence.employeeName : (absence.type || "Time Off")}
                </CardTitle>
                <CardDescription>
                  {!isEmployee && absence.employeeName && (absence.type || "Time Off")} {!isEmployee && absence.employeeName && " • "}
                  {absence.startDate && format(parseISO(absence.startDate), "dd MMM yyyy")} - 
                  {absence.endDate && format(parseISO(absence.endDate), "dd MMM yyyy")}
                </CardDescription>
              </div>
              {getStatusBadge(absence.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {absence.notes && (
                <div className="text-sm">
                  <span className="font-medium">Reason: </span>
                  {absence.notes}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Requested on {absence.requestDate ? format(parseISO(absence.requestDate), "dd MMM yyyy") : "Unknown"}</span>
              </div>
              
              {!isEmployee && absence.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ));
    }

    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>{emptyMessage}</p>
          {isEmployee && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowRequestForm(true)}
            >
              Request Time Off
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="page-container pb-16">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full">
          <SidebarTrigger className="bg-primary text-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg" />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Request Time Off
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
            </DialogHeader>
            <RequestTimeOffForm onClose={() => setShowRequestForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* For employees: Show requests directly without tabs */}
      {isEmployee ? (
        <div className="space-y-4">
          {renderAbsenceCards(
            filteredUserAbsences, 
            userAbsencesLoading, 
            "You don't have any absence requests yet"
          )}
        </div>
      ) : (
        /* For non-employees: Show tabs with My Requests and Team Requests */
        <Tabs defaultValue="my-requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            {canViewAllAbsences && <TabsTrigger value="team-requests">Team Requests</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="my-requests">
            <div className="space-y-4">
              {renderAbsenceCards(
                filteredUserAbsences, 
                userAbsencesLoading, 
                "You don't have any absence requests yet"
              )}
            </div>
          </TabsContent>
          
          {canViewAllAbsences && (
            <TabsContent value="team-requests">
              <div className="space-y-4">
                {renderAbsenceCards(
                  filteredTeamAbsences, 
                  teamAbsencesLoading, 
                  "No team absence requests found"
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default Absences;
