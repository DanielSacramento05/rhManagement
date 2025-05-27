
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthContext } from "@/App";
import { isAuthenticated } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { updateAuthState } = useContext(AuthContext);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md mx-auto">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm updateAuthState={updateAuthState} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm updateAuthState={updateAuthState} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => navigate('/tutorial')} className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>View App Tutorial</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
