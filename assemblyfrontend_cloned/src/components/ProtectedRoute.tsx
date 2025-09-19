import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    console.log("ProtectedRoute: Checking authentication");
    const token = localStorage.getItem("token");
    console.log("ProtectedRoute: Token found:", token ? "Yes" : "No");

    if (!token) {
      console.log("ProtectedRoute: No token found, showing toast and redirecting");
      
      // Show toast immediately
      toast({
        variant: "destructive",
        title: "🚫 Access Denied",
        description: "Please login to access this page.",
        duration: 3000,
      });

      console.log("ProtectedRoute: Toast triggered, waiting before navigation");
      
      // Set flag to show toast
      setShowToast(true);
      
      // Navigate after a delay to allow toast to be visible
      const timer = setTimeout(() => {
        console.log("ProtectedRoute: Navigating to login page");
        navigate("/assemblynah/", {
          replace: true,
          state: { showToast: true },
        });
        
      }); 
      
      return () => {
        console.log("ProtectedRoute: Cleaning up timeout");
        clearTimeout(timer);
      };
    } else {
      console.log("ProtectedRoute: Token found, allowing access");
      setIsAuthenticated(true);
    }
  }, [navigate, toast]);

  // Show nothing while checking authentication or showing toast
  if (isAuthenticated === null || showToast) {
    console.log("ProtectedRoute: Authentication status unknown or showing toast, rendering null");
    return null;
  }

  console.log("ProtectedRoute: Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated");
  
  // Only render children if authenticated
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;