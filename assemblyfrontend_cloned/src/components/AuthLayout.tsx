// components/AuthLayout.tsx
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Show toast with a slight delay to ensure component is mounted
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "🚫 Access Denied",
          description: "Please login to access this page.",
          duration: 3000,
        });

        // Navigate after toast duration
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2500);
      }, 100);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate, toast]);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
