
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TimeClockEntry, getTimeClockEntries, updateTimeClockEntry, deleteTimeClockEntry } from "@/services/timeClockService";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import { getEmployees } from "@/services/employeeService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TimeClockManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedEntry, setSelectedEntry] = useState<TimeClockEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  
  // Form state
  const [editForm, setEditForm] = useState({
    clockInTime: "",
    clockOutTime: "",
    date: "",
    totalHours: 0
  });

  // Query employees for filter
  const { data: employeesData } = useQuery({
    queryKey: ['employees', { pageSize: 100 }],
    queryFn: () => getEmployees({ pageSize: 100 }),
  });

  // Query time clock entries
  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['timeclock', 'manager', page, pageSize, selectedEmployeeId],
    queryFn: () => getTimeClockEntries({
      employeeId: selectedEmployeeId || undefined,
      page,
      pageSize,
    }),
  });

  const entries = entriesData?.data || [];
  const totalCount = entriesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Update entry mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: string, entry: Partial<TimeClockEntry> }) => 
      updateTimeClockEntry(data.id, data.entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeclock'] });
      toast({
        title: "Entry Updated",
        description: "Time clock entry was successfully updated.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Error: ${error.toString()}`,
        variant: "destructive"
      });
    }
  });

  // Delete entry mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTimeClockEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeclock'] });
      toast({
        title: "Entry Deleted",
        description: "Time clock entry was successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: `Error: ${error.toString()}`,
        variant: "destructive"
      });
    }
  });

  const handleEdit = (entry: TimeClockEntry) => {
    setSelectedEntry(entry);
    setEditForm({
      clockInTime: entry.clockInTime,
      clockOutTime: entry.clockOutTime || "",
      date: entry.date,
      totalHours: entry.totalHours || 0
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (entry: TimeClockEntry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntry) {
      deleteMutation.mutate(selectedEntry.id);
    }
  };

  const handleSaveEdit = () => {
    if (selectedEntry) {
      updateMutation.mutate({
        id: selectedEntry.id,
        entry: {
          clockInTime: editForm.clockInTime,
          clockOutTime: editForm.clockOutTime || null,
          date: editForm.date,
          totalHours: editForm.totalHours || null,
          status: editForm.clockOutTime ? 'completed' : 'active'
        }
      });
    }
  };

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

  const getEmployeeName = (employeeId: string) => {
    const employee = employeesData?.data.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  // Normalize API data to handle both camelCase and snake_case
  const normalizedEntries = entries.map((entry: any) => ({
    id: entry.id,
    employeeId: entry.employeeId || entry.employee_id,
    date: entry.date,
    clockInTime: entry.clockInTime || entry.clock_in_time,
    clockOutTime: entry.clockOutTime || entry.clock_out_time,
    totalHours: entry.totalHours || entry.total_hours,
    status: entry.status,
  }));

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Time Clock Manager</CardTitle>
        <div className="mt-4">
          <Label htmlFor="employeeFilter">Filter by Employee</Label>
          <div className="flex gap-2 mt-1">
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Employees</SelectItem>
                {employeesData?.data.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmployeeId && (
              <Button variant="outline" onClick={() => setSelectedEmployeeId("")}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : normalizedEntries.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No time clock entries found</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normalizedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{getEmployeeName(entry.employeeId)}</TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{formatTime(entry.clockInTime)}</TableCell>
                    <TableCell>{formatTime(entry.clockOutTime)}</TableCell>
                    <TableCell>{formatDuration(entry)}</TableCell>
                    <TableCell>
                      <span className={entry.status === 'active' ? 'text-green-600' : ''}>
                        {entry.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEdit(entry)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDelete(entry)}
                          title="Delete"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Clock Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
              <Input 
                id="date" 
                value={editForm.date} 
                onChange={(e) => setEditForm({...editForm, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="clockInTime">Clock In Time (HH:MM:SS)</Label>
              <Input 
                id="clockInTime" 
                value={editForm.clockInTime} 
                onChange={(e) => setEditForm({...editForm, clockInTime: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="clockOutTime">Clock Out Time (HH:MM:SS)</Label>
              <Input 
                id="clockOutTime" 
                value={editForm.clockOutTime} 
                onChange={(e) => setEditForm({...editForm, clockOutTime: e.target.value})}
                placeholder="Leave empty for active entries"
              />
            </div>
            <div>
              <Label htmlFor="totalHours">Total Hours</Label>
              <Input 
                id="totalHours" 
                type="number" 
                value={editForm.totalHours || ''} 
                onChange={(e) => setEditForm({...editForm, totalHours: parseFloat(e.target.value)})}
                placeholder="Calculated automatically for complete entries"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this time clock entry? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default TimeClockManager;
