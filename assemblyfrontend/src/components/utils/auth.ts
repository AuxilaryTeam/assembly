import { User, UserRole } from "@/components/ProtectedRoute";

export const saveUserData = (user: User, token: string): void => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error("Failed to save user data");
  }
};

export const clearUserData = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getUserData = (): User | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

export const hasPermission = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    user: 2,
    moderator: 3,
    admin: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
