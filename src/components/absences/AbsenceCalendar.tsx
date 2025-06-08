
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

  // Get approved absences for calendar display
  const approvedAbsences = absences.filter(absence => absence.status === 'approved');

  // Function to check if a date has any absences
  const getAbsencesForDate = (date: Date) => {
    return approvedAbsences.filter(absence => {
      if (!absence.startDate || !absence.endDate) return false;
      const startDate = parseISO(absence.startDate);
      const endDate = parseISO(absence.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Custom day renderer to show absence indicators
  const modifiers = {
    hasAbsence: (date: Date) => getAbsencesForDate(date).length > 0,
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
              {selectedDateAbsences.map((absence) => (
                <div key={absence.id || absence.employeeId} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{absence.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{absence.type}</p>
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
                  {absence.startDate && absence.endDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(parseISO(absence.startDate), "MMM d")} - {format(parseISO(absence.endDate), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No absences on this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
