
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/services/authService";
import { updateEmployee } from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle, Image } from "lucide-react";
import { AuthContext } from "@/App";
import { useContext } from "react";

const formSchema = z.object({
  position: z.string().min(2, { message: "Position is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  pictureUrl: z.string().optional(),
});

export default function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateAuthState } = useContext(AuthContext);
  const currentUser = getCurrentUser();

  // Redirect to dashboard if user already has position and department
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch departments
  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments()
  });

  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      department: "",
      pictureUrl: "",
    },
  });

  // Setup mutation for profile update
  const updateMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (!currentUser?.id) throw new Error("User not found");
      return updateEmployee(currentUser.id, values);
    },
    onSuccess: () => {
      toast({
        title: "Profile setup complete",
        description: "Your profile has been updated successfully."
      });
      setIsComplete(true);
      
      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate('/');
        updateAuthState(); // Update auth state to reflect profile completion
      }, 2000);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    updateMutation.mutate(values);
  };

  if (isComplete) {
    return (
      <div className="container max-w-md flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>
              Your profile has been successfully set up. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide some additional information to complete your profile setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentsLoading ? (
                            <SelectItem value="loading">Loading departments...</SelectItem>
                          ) : (
                            departmentsData?.data.map(dept => (
                              <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pictureUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture (optional)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          placeholder="https://example.com/picture.jpg" 
                          {...field} 
                        />
                        {field.value && (
                          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-primary">
                            <img 
                              src={field.value} 
                              alt="Profile Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";
                              }}
                            />
                          </div>
                        )}
                        {!field.value && (
                          <div className="w-24 h-24 rounded-full mx-auto bg-muted flex items-center justify-center">
                            <Image className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
