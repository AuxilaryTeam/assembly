import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldAlert,
  CheckCircle,
  LogIn,
  Eye,
  EyeOff,
  User,
  Lock,
  Loader2,
} from "lucide-react";
import { userLogin } from "./utils/api";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const state = location.state as { showToast?: boolean };

    if (state?.showToast) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Access Denied</span>
          </div>
        ),
        description: "Please login to access this page.",
        duration: 4000,
      });

      // Clear state so toast doesn't show again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, toast, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}authenticate`,
        { username, password },
        {
          validateStatus: () => true, // Let us manually check status
        }
      );

      if (
        typeof response.data !== "string" ||
        response.data.includes("<!DOCTYPE html") ||
        response.status !== 200
      ) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", response.data);

      const response2 = await userLogin({
        username: username,
        password: password,
      });

      localStorage.setItem("voteServiceToken", response2.data.token);

      toast({
        variant: "success",
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Login Successful</span>
          </div>
        ),
        description: "Redirecting to dashboard...",
        duration: 2000,
      });

      setTimeout(() => navigate("/search"), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Login Failed</span>
          </div>
        ),
        description:
          "Invalid username or password, or server error. Please try again.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-amber-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Assembly Login</h1>
          <p className="text-gray-500">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <User className="w-4 h-4" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors"
                placeholder="Enter your username"
                required
                autoFocus
                disabled={loading}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}>
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 px-6 py-3 text-base font-medium text-white rounded-lg transition-all ${
              loading
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg"
            }`}>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-center text-gray-500 pt-4 border-t border-gray-200">
          Secure authentication system for assembly operations
        </p>
      </div>
    </div>
  );
};

export default Login;
