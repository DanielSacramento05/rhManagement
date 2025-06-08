import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/services/authService";
import { getActiveTimeClockEntry, clockIn, clockOut } from "@/services/timeClockService";
import { format, parseISO, isValid } from "date-fns";
import { Clock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function TimeClock() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || '';

  // Fetch current active time clock entry
  const { data: activeEntryData } = useQuery({
    queryKey: ['timeclock', 'active', userId],
    queryFn: () => getActiveTimeClockEntry(userId),
    enabled: !!userId,
  });

  const activeEntry = activeEntryData?.data || null;
  const isClockedIn = !!activeEntry;

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: () => clockIn(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeclock'] });
      toast({
        title: "Clocked In",
        description: `Successfully clocked in at ${format(new Date(), 'HH:mm')}`,
      });
    },
    onError: (error: any) => {
      if (error.message.includes('on leave')) {
        setShowLeaveAlert(true);
      } else {
        toast({
          title: "Clock In Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: () => clockOut(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['timeclock'] });
      
      // Debug: Log the full response to see what we're getting
      console.log('Clock out response:', response);
      
      // Handle the API response structure properly
      const timeClockEntry = response.data;
      console.log('Time clock entry:', timeClockEntry);
      
      // Try multiple possible field names for total hours
      const hours = timeClockEntry?.totalHours || 
                   timeClockEntry?.total_hours || 
                   (timeClockEntry as any)?.['total_hours'] || 
                   0;
      
      console.log('Hours worked:', hours);
      const formattedHours = Number(hours).toFixed(2);
      
      toast({
        title: "Clocked Out",
        description: `Successfully clocked out. Total hours: ${formattedHours}`,
      });
    },
  });

  const handleClockAction = () => {
    setIsLoading(true);
    
    if (isClockedIn) {
      clockOutMutation.mutate(undefined, {
        onSettled: () => setIsLoading(false)
      });
    } else {
      clockInMutation.mutate(undefined, {
        onSettled: () => setIsLoading(false)
      });
    }
  };

  // Safe format function to handle potential invalid dates
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      
      // For API responses with date and time in separate fields
      if (!dateString.includes('T') && !dateString.includes(' ')) {
        // If we have activeEntry with date and clockInTime separate
        if (activeEntry?.date && activeEntry?.clockInTime) {
          const fullDateString = `${activeEntry.date}T${activeEntry.clockInTime}`;
          const parsedDate = parseISO(fullDateString);
          if (isValid(parsedDate)) {
            return format(parsedDate, 'HH:mm');
          }
        }
        return "Invalid date";
      }
      
      // For standard ISO format
      const parsedDate = parseISO(dateString);
      if (isValid(parsedDate)) {
        return format(parsedDate, 'HH:mm');
      }
      return "Invalid date";
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-medium">Time Clock</h3>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isClockedIn ? (
                <>
                  {activeEntry.date && activeEntry.clockInTime ? (
                    `Clocked in at ${safeFormatDate(`${activeEntry.date}T${activeEntry.clockInTime}`)}`
                  ) : (
                    "Currently clocked in"
                  )}
                </>
              ) : (
                "Not clocked in"
              )}
            </p>
            
            <Button 
              onClick={handleClockAction} 
              disabled={isLoading}
              className={isClockedIn ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isLoading ? "Processing..." : isClockedIn ? "Clock Out" : "Clock In"}
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showLeaveAlert} onOpenChange={setShowLeaveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unable to Clock In</AlertDialogTitle>
            <AlertDialogDescription>
              You cannot clock in while you are currently on leave. Please contact your manager if you believe this is an error.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLeaveAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TimeClock;
