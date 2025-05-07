
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TimeClockEntry, getTimeClockEntries } from "@/services/timeClockService";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "@/services/authService";

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

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '---';
    try {
      return format(parseISO(timeString), 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", error);
      return '---';
    }
  };

  const formatDate = (timeString: string) => {
    try {
      return format(parseISO(timeString), 'MMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const formatDuration = (entry: TimeClockEntry) => {
    // Check if totalHours exists and is not null before using it
    if (entry.status === 'active') return 'In progress';
    if (entry.totalHours === undefined || entry.totalHours === null) return 'N/A';
    return `${entry.totalHours.toFixed(2)} hrs`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Time Clock Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No recent time clock entries</div>
        ) : (
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
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{formatTime(entry.clockInTime)}</TableCell>
                  <TableCell>{formatTime(entry.clockOutTime)}</TableCell>
                  <TableCell>{formatDuration(entry)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default TimeClockHistory;
