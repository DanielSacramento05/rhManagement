
import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { format, getDaysInMonth, getMonth, getYear, parseISO, startOfMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getAbsences, updateAbsenceStatus, deleteAbsence } from "@/services/absenceService";
import { Absence, AbsenceFilters } from "@/types";
import RequestTimeOffForm from "@/components/absences/RequestTimeOffForm";
import { getCurrentUser } from "@/services/authService";

const Absences = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [requestTimeOffOpen, setRequestTimeOffOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get current user
  const currentUser = getCurrentUser();
  const isManager = currentUser?.role === "manager" || currentUser?.role === "admin";
  const userId = currentUser?.id || '';
  
  // Check for authentication
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || !JSON.parse(user).isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Safely parse ISO dates with error handling
  const safeParseISO = (dateString: string | undefined | null) => {
    if (!dateString) return new Date(); // Default to current date if undefined/null
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error("Error parsing date:", error, dateString);
      return new Date(); // Return current date as fallback
    }
  };

  // Build filter parameters for API
  const buildFilters = (): AbsenceFilters => {
    // For employees, only show their own absences
    // For managers, show all absences
    return {
      page: 1,
      pageSize: 50,
      employeeId: isManager ? undefined : userId,
      type: selectedType || undefined,
      status: selectedStatus || undefined
    };
  };

  // Fetch absences with react-query
  const {
    data: absencesData,
    isLoading: absencesLoading,
    error: absencesError,
    isError
  } = useQuery({
    queryKey: ['absences', buildFilters()],
    queryFn: () => getAbsences(buildFilters()),
    staleTime: 60000,
  });

  // Mutations for updating absence status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, approvedBy }: { id: string; status: 'approved' | 'declined'; approvedBy: string }) => 
      updateAbsenceStatus(id, status, approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  });

  // Mutation for canceling a request
  const cancelRequestMutation = useMutation({
    mutationFn: (id: string) => deleteAbsence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  });

  useEffect(() => {
    if (absencesError) {
      console.error("Error loading absences:", absencesError);
      toast({
        title: "Error loading absences",
        description: "Could not load absence data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [absencesError, toast]);

  // Calendar helpers
  const currentMonth = getMonth(date);
  const currentYear = getYear(date);
  const daysInMonth = getDaysInMonth(date);
  const firstDayOfMonth = startOfMonth(date).getDay();
  
  // Days of the week for calendar header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Go to previous month
  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  // Go to next month
  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  // Handle approve/decline
  const handleStatusUpdate = (id: string, status: 'approved' | 'declined') => {
    // Only managers can approve/decline
    if (!isManager) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "You don't have permission to approve/decline requests.",
      });
      return;
    }
    
    if (!currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to approve/decline requests.",
      });
      return;
    }
    
    // Use the current user's ID as the approver
    const approvedBy = currentUser.id;
    
    console.log(`Approving/declining absence ${id} with status ${status} by ${approvedBy}`);
    
    updateStatusMutation.mutate({ id, status, approvedBy }, {
      onSuccess: () => {
        toast({
          title: `Request ${status}`,
          description: `The absence request has been ${status}.`,
        });
      },
      onError: (error) => {
        console.error("Error updating status:", error);
        toast({
          variant: "destructive",
          title: "Error updating status",
          description: "There was a problem updating the request status.",
        });
      }
    });
  };

  // Handle request cancellation
  const handleCancelRequest = (id: string) => {
    cancelRequestMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Request cancelled",
          description: "Your absence request has been cancelled.",
        });
      },
      onError: (error) => {
        console.error("Error cancelling request:", error);
        toast({
          variant: "destructive",
          title: "Error cancelling request",
          description: "There was a problem cancelling your request.",
        });
      }
    });
  };

  // Filter absences based on selected filters
  const filteredAbsences = absencesData?.data || [];
  
  console.log("Current absences data:", filteredAbsences);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Declined</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Vacation":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{type}</Badge>;
      case "Sick Leave":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{type}</Badge>;
      case "Personal":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{type}</Badge>;
      case "Training":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Check if a day has any absences - with safe date parsing
  const hasAbsence = (day: number) => {
    if (!filteredAbsences || filteredAbsences.length === 0) return false;
    
    const checkDate = new Date(currentYear, currentMonth, day);
    return filteredAbsences.some((absence) => {
      const start = safeParseISO(absence.startDate || absence.start_date);
      const end = safeParseISO(absence.endDate || absence.end_date);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Get absences for a specific day - with safe date parsing
  const getAbsencesForDay = (day: number) => {
    if (!filteredAbsences || filteredAbsences.length === 0) return [];
    
    const checkDate = new Date(currentYear, currentMonth, day);
    return filteredAbsences.filter((absence) => {
      const start = safeParseISO(absence.startDate || absence.start_date);
      const end = safeParseISO(absence.endDate || absence.end_date);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Check if user can modify the absence (their own and still pending)
  const canCancelRequest = (absence: Absence) => {
    const absenceEmployeeId = absence.employeeId || absence.employee_id;
    return absenceEmployeeId === userId && absence.status === 'pending';
  };

  // Calendar view helpers
  const currentMonth = getMonth(date);
  const currentYear = getYear(date);
  const daysInMonth = getDaysInMonth(date);
  const firstDayOfMonth = startOfMonth(date).getDay();
  
  // Days of the week for calendar header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Go to previous month
  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  // Go to next month
  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  // If there's an error connecting to the API, show a nice error message
  if (isError) {
    return (
      <div className="page-container pb-16">
        <div className="animate-in">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">Absences</h1>
          <p className="text-muted-foreground mb-8">
            Manage and track time off requests.
          </p>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load absence data</h2>
          <p className="text-muted-foreground mb-6">
            There was a problem connecting to the absence management system.
          </p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['absences'] })}>
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container pb-16">
      {/* Page header section */}
      <div className="animate-in">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Absences</h1>
        <p className="text-muted-foreground mb-8">
          Manage and track time off requests.
        </p>
      </div>

      {/* View toggle and request button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-in">
        <div className="flex items-center space-x-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            List View
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            Calendar View
          </Button>
        </div>

        <Button className="ml-auto" onClick={() => setRequestTimeOffOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Request Time Off
        </Button>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 animate-in">
        <Select onValueChange={(value) => setSelectedType(value === "all" ? null : value)} value={selectedType || "all"}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Vacation">Vacation</SelectItem>
            <SelectItem value="Sick Leave">Sick Leave</SelectItem>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Training">Training</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)} value={selectedStatus || "all"}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Filter by Date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Loading indicator */}
      {absencesLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading absences...</p>
        </div>
      ) : view === "list" ? (
        // List view
        <div className="grid grid-cols-1 gap-4 animate-in">
          {filteredAbsences && filteredAbsences.length > 0 ? (
            filteredAbsences.map((absence) => (
              <Card
                key={absence.id}
                className="overflow-hidden transition-all duration-300 card-hover"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <img
                        src={absence.imageUrl || "https://randomuser.me/api/portraits/men/1.jpg"}
                        alt={absence.employeeName || "Employee"}
                        className="object-cover"
                      />
                    </Avatar>

                    <div className="sm:flex-1 text-center sm:text-left">
                      <h3 className="font-medium text-lg">{absence.employeeName || "Employee"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {absence.position || "Position"} • {absence.department || "Department"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                        {getTypeBadge(absence.type)}
                        {getStatusBadge(absence.status)}
                      </div>
                      <p className="text-sm">
                        {format(safeParseISO(absence.startDate || absence.start_date), "MMM d")} -{" "}
                        {format(safeParseISO(absence.endDate || absence.end_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                {isManager && absence.status === "pending" && (
                  <div className="bg-muted/50 px-6 py-3 flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500"
                      onClick={() => handleStatusUpdate(absence.id, 'declined')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Decline
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleStatusUpdate(absence.id, 'approved')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                )}
                
                {canCancelRequest(absence) && (
                  <div className="bg-muted/50 px-6 py-3 flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500"
                      onClick={() => handleCancelRequest(absence.id)}
                      disabled={cancelRequestMutation.isPending}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Cancel Request
                    </Button>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No absences found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedType(null);
                  setSelectedStatus(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="animate-in">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                {format(date, "MMMM yyyy")}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Calendar header */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-24 p-2 border rounded-md bg-muted/20"></div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayAbsences = getAbsencesForDay(day);
                const hasAbsences = dayAbsences.length > 0;

                return (
                  <div
                    key={day}
                    className={`min-h-24 p-2 border rounded-md transition-colors ${
                      hasAbsences ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayAbsences.slice(0, 3).map((absence) => (
                        <div
                          key={absence.id}
                          className="text-xs p-1 rounded bg-white shadow-sm truncate"
                          title={`${absence.employeeName || "Employee"} - ${absence.type}`}
                        >
                          {absence.employeeName || "Employee"}
                        </div>
                      ))}
                      {dayAbsences.length > 3 && (
                        <div className="text-xs text-center text-muted-foreground">
                          +{dayAbsences.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Request Time Off Dialog */}
      <Dialog open={requestTimeOffOpen} onOpenChange={setRequestTimeOffOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
          </DialogHeader>
          <RequestTimeOffForm onClose={() => setRequestTimeOffOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Absences;
