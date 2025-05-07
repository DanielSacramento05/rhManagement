
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, isAuthenticated } from "@/services/authService";
import { getEmployeeById, updateEmployee } from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Employee } from "@/types";
import { Loader2, User, Image } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  position: z.string().min(2, { message: "Position is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  pictureUrl: z.string().optional(),
});

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch employee data
  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee', currentUser?.id],
    queryFn: () => getEmployeeById(currentUser?.id || ''),
    enabled: !!currentUser?.id
  });

  // Fetch departments
  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments()
  });

  // Setup form with employee data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      pictureUrl: ""
    },
  });

  // Update form values when employee data is loaded
  useEffect(() => {
    if (employeeData?.data) {
      const employee = employeeData.data;
      form.reset({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        pictureUrl: employee.pictureUrl || ''
      });
    }
  }, [employeeData, form]);

  // Setup mutation for profile update
  const updateMutation = useMutation({
    mutationFn: (values: Partial<Employee>) => {
      return updateEmployee(currentUser?.id || '', values);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      setIsEditing(false);
      // Invalidate the query to refetch the employee data
      queryClient.invalidateQueries({ queryKey: ['employee', currentUser?.id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(values);
  };

  if (employeeLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>
            View and update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-center mb-6">
                <FormField
                  control={form.control}
                  name="pictureUrl"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-3">
                      <Avatar className="w-24 h-24 border-2 border-primary">
                        {field.value ? (
                          <AvatarImage 
                            src={field.value} 
                            alt="Profile" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";
                            }}
                          />
                        ) : null}
                        <AvatarFallback className="text-4xl">
                          <User size={36} />
                        </AvatarFallback>
                      </Avatar>
                      
                      {isEditing && (
                        <>
                          <FormControl>
                            <Input 
                              placeholder="Profile image URL" 
                              {...field} 
                              disabled={updateMutation.isPending} 
                              className="w-full max-w-xs"
                            />
                          </FormControl>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => form.setValue('pictureUrl', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7')}
                              disabled={updateMutation.isPending}
                            >
                              <Image className="h-4 w-4 mr-1" /> Sample 1
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => form.setValue('pictureUrl', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')}
                              disabled={updateMutation.isPending}
                            >
                              <Image className="h-4 w-4 mr-1" /> Sample 2
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => form.setValue('pictureUrl', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952')}
                              disabled={updateMutation.isPending}
                            >
                              <Image className="h-4 w-4 mr-1" /> Sample 3
                            </Button>
                          </div>
                          <FormMessage />
                        </>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          disabled={!isEditing || updateMutation.isPending} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          disabled={!isEditing || updateMutation.isPending} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          {...field} 
                          disabled={!isEditing || updateMutation.isPending} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Software Developer" 
                          {...field} 
                          disabled={!isEditing || updateMutation.isPending} 
                        />
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
                        {isEditing ? (
                          <Select 
                            disabled={updateMutation.isPending}
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentsLoading ? (
                                <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                              ) : (
                                departmentsData?.data.map(dept => (
                                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            {...field} 
                            disabled={true} 
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
          <Button variant="outline" onClick={() => navigate('/')}>Back to Dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
