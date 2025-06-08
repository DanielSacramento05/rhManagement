
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isWithinInterval } from "date-fns";
import { Absence } from "@/types";

interface AbsenceCalendarProps {
  absences: Absence[];
}

export function AbsenceCalendar({ absences }: AbsenceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  console.log("AbsenceCalendar received absences:", absences);

  // Get approved absences for calendar display
  const approvedAbsences = absences.filter(absence => {
    console.log("Filtering absence:", absence, "status:", absence.status);
    return absence.status === 'approved';
  });

  console.log("Approved absences:", approvedAbsences);

  // Function to check if a date has any absences
  const getAbsencesForDate = (date: Date) => {
    return approvedAbsences.filter(absence => {
      if (!absence.startDate && !absence.start_date) return false;
      if (!absence.endDate && !absence.end_date) return false;
      
      // Handle both camelCase and snake_case date fields
      const startDateStr = absence.startDate || absence.start_date;
      const endDateStr = absence.endDate || absence.end_date;
      
      if (!startDateStr || !endDateStr) return false;
      
      try {
        const startDate = parseISO(startDateStr);
        const endDate = parseISO(endDateStr);
        const isInRange = isWithinInterval(date, { start: startDate, end: endDate });
        
        if (isInRange) {
          console.log(`Date ${format(date, 'yyyy-MM-dd')} is within absence range ${startDateStr} to ${endDateStr}`);
        }
        
        return isInRange;
      } catch (error) {
        console.error("Error parsing dates for absence:", absence, error);
        return false;
      }
    });
  };

  // Custom day renderer to show absence indicators
  const modifiers = {
    hasAbsence: (date: Date) => {
      const absencesForDate = getAbsencesForDate(date);
      return absencesForDate.length > 0;
    },
  };

  const modifiersClassNames = {
    hasAbsence: "bg-blue-100 text-blue-900 font-semibold",
  };

  // Get absences for selected date
  const selectedDateAbsences = selectedDate ? getAbsencesForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Absence Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
          />
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Highlighted dates indicate approved absences</p>
            <p>• Click on a date to see absence details</p>
            <p className="text-xs mt-2">Total approved absences: {approvedAbsences.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAbsences.length > 0 ? (
            <div className="space-y-3">
              {selectedDateAbsences.map((absence, index) => (
                <div key={absence.id || `${absence.employeeId}-${index}`} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{absence.employeeName || 'Unknown Employee'}</p>
                      <p className="text-sm text-muted-foreground">{absence.type || 'Time Off'}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {absence.status}
                    </Badge>
                  </div>
                  {absence.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {absence.notes}
                    </p>
                  )}
                  {(absence.startDate || absence.start_date) && (absence.endDate || absence.end_date) && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(parseISO(absence.startDate || absence.start_date!), "MMM d")} - {format(parseISO(absence.endDate || absence.end_date!), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No absences on this date</p>
              {selectedDate && (
                <p className="text-xs mt-2">
                  Selected: {format(selectedDate, "MMM d, yyyy")}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
