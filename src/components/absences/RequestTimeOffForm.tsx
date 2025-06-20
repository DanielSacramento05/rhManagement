import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createAbsence } from "@/services/absenceService";
import { getCurrentUser } from "@/services/authService";

const formSchema = z.object({
  type: z.enum(["Vacation", "Sick Leave", "Personal", "Training"], {
    required_error: "Please select an absence type",
  }),
  startDate: z.date({
    required_error: "A start date is required",
  }),
  endDate: z.date({
    required_error: "An end date is required",
  }),
  notes: z.string().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be earlier than start date",
  path: ["endDate"],
});

type RequestTimeOffFormProps = {
  onClose: () => void;
};

export function RequestTimeOffForm({ onClose }: RequestTimeOffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || '';
  const userName = currentUser?.name || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Vacation",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to request time off.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format the request with field names that match the backend expectations
      // and include the employee information but remove email field
      const absenceRequest = {
        employee_id: userId,
        type: values.type,
        status: "pending" as const,
        start_date: format(values.startDate, "yyyy-MM-dd"),
        end_date: format(values.endDate, "yyyy-MM-dd"),
        notes: values.notes || "",
        // Include additional user data for UI display but not sent to API
        employeeName: userName
      };
      
      console.log("Submitting absence request:", absenceRequest);
      await createAbsence(absenceRequest);
      
      toast({
        title: "Request submitted",
        description: "Your time off request has been submitted for approval.",
      });
      
      // Invalidate and refetch absences query
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      
      onClose();
    } catch (error) {
      console.error("Error submitting absence request:", error);
      toast({
        variant: "destructive",
        title: "Error submitting request",
        description: error instanceof Error ? error.message : "There was a problem submitting your request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Absence Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select absence type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal">Personal Leave</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || 
                        (form.getValues().startDate && date < form.getValues().startDate)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional information about your absence request..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include any details that might help with approval of your request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RequestTimeOffForm;
