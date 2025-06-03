
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
import { register as registerUser, setPassword, saveUserToLocalStorage, AuthResponse, checkUserExists } from "@/services/authService";
import { RegisterCredentials, SetPasswordCredentials } from "@/types/auth";

// Create a dynamic schema based on whether it's an existing user
const createFormSchema = (isExistingUser: boolean) => {
  return z.object({
    name: isExistingUser 
      ? z.string().optional()
      : z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
};

interface RegisterFormProps {
  updateAuthState: () => void;
}

export function RegisterForm({ updateAuthState }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingUserName, setExistingUserName] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Create form with dynamic schema
  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(createFormSchema(isExistingUser)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    },
  });

  // Re-create form when user type changes
  const updateFormSchema = (existingUser: boolean) => {
    setIsExistingUser(existingUser);
    
    // Get current form values
    const currentValues = form.getValues();
    
    // Create new form with updated schema
    const newForm = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
      resolver: zodResolver(createFormSchema(existingUser)),
      defaultValues: currentValues,
    });
    
    // Replace form methods
    Object.assign(form, newForm);
  };

  const handleEmailBlur = async () => {
    console.log('🔍 Email blur handler triggered');
    const email = form.getValues('email');
    console.log('📧 Email value:', email);
    
    if (!email || !email.includes('@')) {
      console.log('⚠️ Invalid email, skipping check');
      return;
    }

    try {
      console.log('🔄 Checking if user exists...');
      const userCheck = await checkUserExists(email);
      console.log('✅ User check result:', userCheck);
      
      if (userCheck.exists && !userCheck.hasPassword) {
        console.log('👤 Existing user without password found');
        updateFormSchema(true);
        setExistingUserName(userCheck.name || "");
        // Clear name field since it's not needed for existing users
        form.setValue('name', '');
        toast({
          title: "Employee found",
          description: `Welcome ${userCheck.name}! Please set your password to complete your account setup.`,
        });
      } else if (userCheck.exists && userCheck.hasPassword) {
        console.log('👤 User with password already exists');
        updateFormSchema(false);
        setExistingUserName("");
        toast({
          variant: "destructive",
          title: "Account exists",
          description: "This email is already registered with a password. Please use the login form instead.",
        });
        return;
      } else {
        console.log('🆕 New user - can proceed with registration');
        updateFormSchema(false);
        setExistingUserName("");
      }
    } catch (error) {
      console.error('❌ Error checking user:', error);
      updateFormSchema(false);
      setExistingUserName("");
      // Don't show error toast for network issues during email check
      // The user can still proceed with registration
    }
  };

  const onSubmit = async (values: z.infer<ReturnType<typeof createFormSchema>>) => {
    console.log('🚀 Form submission started');
    console.log('📝 Form values:', values);
    console.log('👤 Is existing user:', isExistingUser);
    
    setIsLoading(true);
    
    try {
      let response: AuthResponse;
      
      if (isExistingUser) {
        // For existing users setting password, use the setPassword function
        const setPasswordData: SetPasswordCredentials = {
          email: values.email,
          password: values.password
        };
        console.log('🔑 Setting password for existing user:', setPasswordData);
        response = await setPassword(setPasswordData);
        console.log('✅ Set password response:', response);
      } else {
        // For new users, send all registration data
        const registrationData: RegisterCredentials = {
          name: values.name!,
          email: values.email,
          password: values.password,
          phone: values.phone || ""
        };
        console.log('📝 Registering new user:', registrationData);
        response = await registerUser(registrationData);
        console.log('✅ Registration response:', response);
      }
      
      const userData: AuthResponse = {
        ...response,
        user: {
          ...response.user,
          status: 'out-of-office' as const
        }
      };
      
      console.log('💾 Saving user to localStorage:', userData);
      saveUserToLocalStorage(userData);
      
      toast({
        title: isExistingUser ? "Password set successfully" : "Registration successful",
        description: isExistingUser 
          ? "You can now access your account." 
          : "Please complete your profile setup.",
      });
      
      console.log('🔄 Updating auth state');
      updateAuthState();
      
      if (isExistingUser) {
        console.log('🏠 Navigating to home page');
        navigate('/');
      } else {
        console.log('👤 Navigating to profile setup');
        navigate('/profile-setup');
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      
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
        title: isExistingUser ? "Password setup failed" : "Registration failed",
        description: errorMessage,
      });
    } finally {
      console.log('🏁 Form submission finished, setting loading to false');
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    console.log('🖱️ Submit button clicked!');
    console.log('⏳ Current loading state:', isLoading);
    console.log('📋 Form is valid:', form.formState.isValid);
    console.log('❌ Form errors:', form.formState.errors);
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
            onClick={handleButtonClick}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>{isExistingUser ? "Setting Password..." : "Creating Account..."}</span>
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
