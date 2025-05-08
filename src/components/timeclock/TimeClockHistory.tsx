
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TimeClockEntry, getTimeClockEntries } from "@/services/timeClockService";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TimeClockHistory() {
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || '';
  
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['timeclock', 'history', userId, page],
    queryFn: () => getTimeClockEntries({
      employeeId: userId,
      page,
      pageSize,
    }),
    enabled: !!userId,
  });

  const entries = entriesData?.data || [];
  const totalCount = entriesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '---';
    try {
      // Handle cases where the API returns time as "HH:MM:SS" instead of ISO format
      if (timeString.includes('T')) {
        return format(parseISO(timeString), 'HH:mm');
      } else {
        // Handle format like "23:31:56"
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        return format(date, 'HH:mm');
      }
    } catch (error) {
      console.error("Error formatting time:", error);
      return '---';
    }
  };

  const formatDate = (timeString: string) => {
    try {
      // Check if it's already in ISO format or just a date string
      if (timeString.includes('T')) {
        return format(parseISO(timeString), 'dd/MM/yyyy');
      } else {
        return format(parseISO(timeString), 'dd/MM/yyyy');
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const formatDuration = (entry: any) => {
    // First check if the entry is active
    if (entry.status === 'active') return 'In progress';
    
    // Try to get totalHours from the response
    if (entry.totalHours !== undefined && entry.totalHours !== null) {
      return `${entry.totalHours.toFixed(2)} hrs`;
    }
    
    // For API responses that use snake_case
    if (entry.total_hours !== undefined && entry.total_hours !== null) {
      return `${Number(entry.total_hours).toFixed(2)} hrs`;
    }
    
    return 'N/A';
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Normalize API data to handle both camelCase and snake_case
  const normalizedEntries = entries.map((entry: any) => ({
    id: entry.id,
    date: entry.date,
    clockInTime: entry.clockInTime || entry.clock_in_time,
    clockOutTime: entry.clockOutTime || entry.clock_out_time,
    totalHours: entry.totalHours || entry.total_hours,
    status: entry.status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Time Clock Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : normalizedEntries.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No recent time clock entries</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normalizedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{formatTime(entry.clockInTime)}</TableCell>
                    <TableCell>{formatTime(entry.clockOutTime)}</TableCell>
                    <TableCell>{formatDuration(entry)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TimeClockHistory;
