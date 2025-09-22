// components/AuthLayout.tsx
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("AuthLayout: Checking authentication");
    const token = localStorage.getItem("token");
    console.log("AuthLayout: Token found:", token ? "Yes" : "No");

    if (!token) {
      console.log("AuthLayout: No token found, showing toast and redirecting");

      // Show toast with a slight delay to ensure component is mounted
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "🚫 Access Denied",
          description: "Please login to access this page.",
          duration: 3000,
        });

        console.log("AuthLayout: Toast shown, navigating in 2.5 seconds");

        // Navigate after toast duration
        setTimeout(() => {
          console.log("AuthLayout: Navigating to login page");
          navigate("/", { replace: true });
        }, 2500);
      }, 100);
    } else {
      console.log("AuthLayout: Token found, allowing access");
      setIsAuthenticated(true);
    }
  }, [navigate, toast]);

  if (isAuthenticated === null) {
    console.log("AuthLayout: Checking authentication, rendering null");
    return null;
  }

  if (!isAuthenticated) {
    console.log("AuthLayout: Not authenticated, rendering null");
    return null;
  }

  console.log("AuthLayout: Authenticated, rendering children");
  return <>{children}</>;
};

export default AuthLayout;
