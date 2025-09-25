import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Show toast immediately
      toast({
        variant: "destructive",
        title: "🚫 Access Denied",
        description: "Please login to access this page.",
        duration: 3000,
      });

      // Set flag to show toast
      setShowToast(true);

      // Navigate after a delay to allow toast to be visible
      const timer = setTimeout(() => {
        navigate("/", {
          replace: true,
          state: { showToast: true },
        });
      });

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate, toast]);

  // Show nothing while checking authentication or showing toast
  if (isAuthenticated === null || showToast) {
    return null;
  }

  // Only render children if authenticated
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
