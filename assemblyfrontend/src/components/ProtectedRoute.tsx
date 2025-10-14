import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

// Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export type UserRole = "admin" | "user" | "viewer" | "moderator";

interface ProtectedRouteProps {
  requiredRoles?: UserRole | UserRole[];
  fallbackRedirect?: string;
}

// Role-based redirect configuration
const roleRedirectPaths: Record<UserRole, string> = {
  admin: "/dashboard",
  user: "/search",
  viewer: "/display",
  moderator: "/positions",
};

// Role hierarchy (higher roles have more permissions)
const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  user: 2,
  moderator: 3,
  admin: 4,
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
  fallbackRedirect = "/",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Parse user data from localStorage with error handling
  const parseUserData = (): User | null => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;

      const parsedUser = JSON.parse(userData);

      // Validate user structure
      if (!parsedUser?.id || !parsedUser?.email || !parsedUser?.role) {
        console.error("Invalid user data structure");
        return null;
      }

      return parsedUser as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Check if user has required role(s)
  const hasRequiredRole = (
    userRole: UserRole,
    required: UserRole | UserRole[]
  ): boolean => {
    if (!required) return true; // No role requirement

    const requiredRolesArray = Array.isArray(required) ? required : [required];

    // Check direct role match or hierarchy (higher roles can access lower role routes)
    return requiredRolesArray.some(
      (requiredRole) =>
        userRole === requiredRole ||
        roleHierarchy[userRole] >= roleHierarchy[requiredRole]
    );
  };

  // Get appropriate redirect path based on user role and context
  const getRedirectPath = (userRole: UserRole, fromPath: string): string => {
    // If we have a fallback redirect from props, use it
    if (fallbackRedirect && fallbackRedirect !== "/") {
      return fallbackRedirect;
    }

    // If access was denied from a specific page, redirect to role-appropriate home
    if (fromPath !== "/") {
      return roleRedirectPaths[userRole] || "/";
    }

    return roleRedirectPaths[userRole] || "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = parseUserData();

    if (!token || !userData) {
      // Show access denied toast
      toast({
        variant: "destructive",
        title: "🚫 Access Denied",
        description: "Please login to access this page.",
        duration: 3000,
      });

      setShowToast(true);

      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 100); // Small delay to ensure toast is visible

      return () => clearTimeout(timer);
    }

    // Check role-based access if requiredRoles is provided
    if (requiredRoles && !hasRequiredRole(userData.role, requiredRoles)) {
      const redirectPath = getRedirectPath(userData.role, location.pathname);

      toast({
        variant: "destructive",
        title: "⛔ Insufficient Permissions",
        description: `Your role (${userData.role}) does not have access to this page.`,
        duration: 4000,
      });

      setShowToast(true);

      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }

    // User is authenticated and has required role
    setUser(userData);
    setIsAuthenticated(true);
  }, [navigate, toast, requiredRoles, location.pathname, fallbackRedirect]);

  // Show loading state while checking authentication
  if (isAuthenticated === null || showToast) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
