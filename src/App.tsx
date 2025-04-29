
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Employees = lazy(() => import("./pages/Employees"));
const Absences = lazy(() => import("./pages/Absences"));
const Performance = lazy(() => import("./pages/Performance"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Auth check component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(user ? JSON.parse(user).isAuthenticated : false);
    };
    
    checkAuth();
    
    // Listen for storage events to update auth state
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  if (isAuthenticated === null) {
    // Still checking authentication
    return <PageLoader />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  // Monitor authentication state for navbar
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(user ? JSON.parse(user).isAuthenticated : false);
    };
    
    checkAuth();
    
    // Listen for storage events to update auth state
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              {isAuthenticated && <Navbar />}
              <div className={isAuthenticated ? "pt-16 min-h-[calc(100vh-4rem)]" : "min-h-screen"}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/employees"
                      element={
                        <ProtectedRoute>
                          <Employees />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/absences"
                      element={
                        <ProtectedRoute>
                          <Absences />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/performance"
                      element={
                        <ProtectedRoute>
                          <Performance />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
