
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { register as registerUser, saveUserToLocalStorage, AuthResponse, checkUserExists } from "@/services/authService";
import { RegisterCredentials, SetPasswordCredentials } from "@/types/auth";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface RegisterFormProps {
  updateAuthState: () => void;
}

export function RegisterForm({ updateAuthState }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingUserName, setExistingUserName] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    },
  });

  const handleEmailBlur = async () => {
    const email = form.getValues('email');
    if (!email || !email.includes('@')) return;

    try {
      const userCheck = await checkUserExists(email);
      if (userCheck.exists && !userCheck.hasPassword) {
        setIsExistingUser(true);
        setExistingUserName(userCheck.name || "");
        // Clear name field since it's not needed for existing users
        form.setValue('name', '');
        toast({
          title: "Employee found",
          description: `Welcome ${userCheck.name}! Please set your password to complete your account setup.`,
        });
      } else if (userCheck.exists && userCheck.hasPassword) {
        setIsExistingUser(false);
        setExistingUserName("");
        toast({
          variant: "destructive",
          title: "Account exists",
          description: "This email is already registered. Please use the login form instead.",
        });
        return;
      } else {
        setIsExistingUser(false);
        setExistingUserName("");
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // Don't show error toast for network issues during email check
      // The user can still proceed with registration
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // For existing users, only send email and password
      const registrationData: RegisterCredentials | SetPasswordCredentials = isExistingUser 
        ? {
            email: values.email,
            password: values.password
          } as SetPasswordCredentials
        : {
            name: values.name!,
            email: values.email,
            password: values.password,
            phone: values.phone
          } as RegisterCredentials;

      const response = await registerUser(registrationData);
      
      const userData: AuthResponse = {
        ...response,
        user: {
          ...response.user,
          status: 'out-of-office' as const
        }
      };
      
      saveUserToLocalStorage(userData);
      
      toast({
        title: isExistingUser ? "Password set successfully" : "Registration successful",
        description: isExistingUser 
          ? "You can now access your account." 
          : "Please complete your profile setup.",
      });
      
      updateAuthState();
      
      if (isExistingUser) {
        navigate('/');
      } else {
        navigate('/profile-setup');
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered with a password. Please use the login form instead.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">
          {isExistingUser ? "Set Your Password" : "Create an account"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isExistingUser 
            ? `Hello ${existingUserName}! Set your password to access your account.`
            : "Enter your details to create a new account"
          }
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isExistingUser && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
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
                    onBlur={handleEmailBlur}
                    disabled={isExistingUser}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!isExistingUser && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
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
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>{isExistingUser ? "Setting Password" : "Creating Account"}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>{isExistingUser ? "Set Password" : "Register"}</span>
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
