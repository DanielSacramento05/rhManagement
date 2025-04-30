
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useState, useEffect, createContext } from "react";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import { isAuthenticated } from "./services/authService";

// Create auth context to share authentication state across components
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  updateAuthState: () => void;
}>({
  isAuthenticated: false,
  updateAuthState: () => {}
});

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Employees = lazy(() => import("./pages/Employees"));
const Absences = lazy(() => import("./pages/Absences"));
const Performance = lazy(() => import("./pages/Performance"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Tutorial = lazy(() => import("./pages/Tutorial"));

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
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
    setAuthChecked(true);
  }, []);
  
  if (!authChecked) {
    return <PageLoader />;
  }
  
  return isUserAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [authState, setAuthState] = useState<boolean>(isAuthenticated());
  
  const updateAuthState = () => {
    setAuthState(isAuthenticated());
  };
  
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ isAuthenticated: authState, updateAuthState }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen">
                {authState && <Navbar />}
                <div className={authState ? "pt-16 min-h-[calc(100vh-4rem)]" : "min-h-screen"}>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/tutorial" element={<Tutorial />} />
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
        </AuthContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
