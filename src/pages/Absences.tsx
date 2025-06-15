
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestTimeOffForm } from "@/components/absences/RequestTimeOffForm";
import { AbsenceCalendar } from "@/components/absences/AbsenceCalendar";
import { Plus, FileText, Clock, CheckCircle, XCircle, Calendar as CalendarIcon, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAbsences, updateAbsenceStatus } from "@/services/absenceService";
import { format, parseISO } from "date-fns";
import { getCurrentUser } from "@/services/authService";
import { hasPermission } from "@/services/permissionService";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Absences = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("requests");
  const [currentPage, setCurrentPage] = useState(1);
  const [teamCurrentPage, setTeamCurrentPage] = useState(1);
  const pageSize = 20; // Increased from default 10
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const currentUser = getCurrentUser();
  const canViewAllAbsences = hasPermission('absences', 'read', 'department');
  const isEmployee = currentUser?.role === 'employee';

  // Fetch user's own absences with pagination
  const { data: userAbsences, isLoading: userAbsencesLoading } = useQuery({
    queryKey: ['absences', currentUser?.id, currentPage, statusFilter],
    queryFn: () => getAbsences({ 
      employeeId: currentUser?.id,
      page: currentPage,
      pageSize,
      ...(statusFilter !== 'all' && { status: statusFilter })
    }),
  });

  // Fetch team absences if user has permission with pagination
  const { data: teamAbsences, isLoading: teamAbsencesLoading } = useQuery({
    queryKey: ['team-absences', teamCurrentPage, statusFilter],
    queryFn: () => getAbsences({ 
      department: currentUser?.departmentName,
      page: teamCurrentPage,
      pageSize,
      ...(statusFilter !== 'all' && { status: statusFilter })
    }),
    enabled: canViewAllAbsences,
  });

  // Handle approve/decline actions
  const handleStatusUpdate = async (absenceId: string, status: 'approved' | 'declined') => {
    if (!currentUser?.id) {
      toast.error("User not found");
      return;
    }

    try {
      await updateAbsenceStatus(absenceId, status, currentUser.id);
      
      // Invalidate and refetch queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['team-absences'] });
      
      toast.success(`Absence request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'decline'} absence request`);
    }
  };

  // Sort absences to show pending first
  const sortAbsencesByPriority = (absences: any[] = []) => {
    return [...absences].sort((a, b) => {
      // Pending absences first
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      
      // Then by request date (newest first)
      const aRequestDate = a.requestDate || a.request_date || a.createdAt || a.created_at;
      const bRequestDate = b.requestDate || b.request_date || b.createdAt || b.created_at;
      
      if (aRequestDate && bRequestDate) {
        return new Date(bRequestDate).getTime() - new Date(aRequestDate).getTime();
      }
      
      return 0;
    });
  };

  const sortedUserAbsences = sortAbsencesByPriority(userAbsences?.data || []);
  const sortedTeamAbsences = sortAbsencesByPriority(teamAbsences?.data || []);

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

  // Helper function to format request date safely
  const formatRequestDate = (absence: any) => {
    try {
      const dateToUse = absence.requestDate || absence.request_date || absence.createdAt || absence.created_at;
      
      if (dateToUse) {
        let date;
        if (typeof dateToUse === 'string') {
          date = new Date(dateToUse);
        } else {
          date = new Date(dateToUse);
        }
        
        if (isNaN(date.getTime())) {
          return "Date not available";
        }
        
        return format(date, "dd MMM yyyy");
      }
      
      return "Date not available";
    } catch (error) {
      return "Date not available";
    }
  };

  const formatDateRange = (absence: any) => {
    try {
      const startDate = absence.startDate || absence.start_date;
      const endDate = absence.endDate || absence.end_date;
      
      if (!startDate || !endDate) {
        return "Date not available";
      }
      
      const formattedStartDate = format(parseISO(startDate), "dd MMM yyyy");
      const formattedEndDate = format(parseISO(endDate), "dd MMM yyyy");
      
      if (formattedStartDate === formattedEndDate) {
        return formattedStartDate;
      }
      
      return `${formattedStartDate} - ${formattedEndDate}`;
    } catch (error) {
      return "Date not available";
    }
  };

  // Render pagination component
  const renderPagination = (totalCount: number, currentPageNum: number, setCurrentPageFunc: (page: number) => void) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPageFunc(Math.max(1, currentPageNum - 1))}
              className={currentPageNum === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {/* Show page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPageFunc(page)}
                  isActive={currentPageNum === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPageFunc(Math.min(totalPages, currentPageNum + 1))}
              className={currentPageNum === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Render absence cards
  const renderAbsenceCards = (absences: any[], isLoading: boolean, emptyMessage: string, totalCount: number, currentPageNum: number, setCurrentPageFunc: (page: number) => void) => {
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
      return (
        <div className="space-y-4">
          {/* Show total count */}
          <div className="text-sm text-muted-foreground">
            Showing {absences.length} of {totalCount} requests
          </div>
          
          {absences.map((absence) => (
            <Card key={absence.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {!isEmployee && absence.employeeName ? absence.employeeName : (absence.type || "Time Off")}
                    </CardTitle>
                    <CardDescription>
                      {!isEmployee && absence.employeeName && (absence.type || "Time Off")} {!isEmployee && absence.employeeName && " • "}
                      {formatDateRange(absence)}
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
                    <span>Requested on {formatRequestDate(absence)}</span>
                  </div>
                  
                  {!isEmployee && absence.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(absence.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(absence.id, 'declined')}
                      >
                        <XCircle className="h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination */}
          {renderPagination(totalCount, currentPageNum, setCurrentPageFunc)}
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>{emptyMessage}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setShowRequestForm(true)}
          >
            Request Time Off
          </Button>
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
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
            setTeamCurrentPage(1);
          }}>
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

      {/* For employees: Show tabs with Calendar and Requests */}
      {isEmployee ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            {renderAbsenceCards(
              sortedUserAbsences, 
              userAbsencesLoading, 
              "You don't have any absence requests yet",
              userAbsences?.totalCount || 0,
              currentPage,
              setCurrentPage
            )}
          </TabsContent>
          
          <TabsContent value="calendar">
            <AbsenceCalendar absences={userAbsences?.data || []} />
          </TabsContent>
        </Tabs>
      ) : (
        /* For non-employees: Show tabs with My Requests, Team Requests and Calendar */
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-requests" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Requests
            </TabsTrigger>
            {canViewAllAbsences && (
              <TabsTrigger value="team-requests" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Team Requests
              </TabsTrigger>
            )}
            {canViewAllAbsences && (
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="my-requests">
            {renderAbsenceCards(
              sortedUserAbsences, 
              userAbsencesLoading, 
              "You don't have any absence requests yet",
              userAbsences?.totalCount || 0,
              currentPage,
              setCurrentPage
            )}
          </TabsContent>
          
          {canViewAllAbsences && (
            <TabsContent value="team-requests">
              {renderAbsenceCards(
                sortedTeamAbsences, 
                teamAbsencesLoading, 
                "No team absence requests found",
                teamAbsences?.totalCount || 0,
                teamCurrentPage,
                setTeamCurrentPage
              )}
            </TabsContent>
          )}
          
          {canViewAllAbsences && (
            <TabsContent value="calendar">
              <AbsenceCalendar absences={teamAbsences?.data || []} />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default Absences;
