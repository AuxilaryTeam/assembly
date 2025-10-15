import { Navigate, Outlet, useLocation } from "react-router-dom";

export type UserRole = "ADMIN" | "USER";

interface ProtectedRouteProps {
  requiredRoles?: UserRole | UserRole[];
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps = {}) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") as UserRole;

  // If no token, redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, showToast: true }}
        replace
      />
    );
  }

  // If roles are required, check authorization
  if (requiredRoles) {
    const requiredRolesArray = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    if (!requiredRolesArray.includes(userRole)) {
      return (
        <Navigate
          to="/search" // Redirect to default page for unauthorized users
          state={{ from: location, showToast: true }}
          replace
        />
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
