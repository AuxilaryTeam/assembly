import { useState } from "react";
import { useForm } from "react-hook-form";
import type { DecodedToken, LoginForm } from "../utils/types";
import { toast } from "react-toastify";
import { userLogin } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { jwtDecode } from "jwt-decode";

export default function SignInForm() {
  const disptach = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    console.log("Login data", data);
    const userData = { email: data.email, password: data.password };
    try {
      const response = await userLogin(userData);
      const loginDetails: { email: string; firstName: string; token: string } =
        response.data;
      localStorage.setItem("token", loginDetails.token);
      const decodedUser = jwtDecode<DecodedToken>(loginDetails.token);
      disptach(
        login({
          user: {
            id: decodedUser.userId,
            firstName: decodedUser.firstName,
            email: decodedUser.sub,
            roleId: decodedUser.roleId,
            roleName: decodedUser.roleName,
          },
          token: loginDetails.token,
        })
      );

      toast.success("User Login successful");
      console.log("Response", response);
      navigate("/");
    } catch (error: any) {
      // Use type any or AxiosError for proper typing
      console.error("Login failed", error);

      // Correct error message extraction
      const errorMessage =
        error.response?.data.message || "An unknown error occurred";

      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="w-fit h-fit flex">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2 focus:outline-none"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              We strongly recommend using your organizational email. This will
              help verify your account.
            </p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded px-3 py-2 focus:outline-none"
              {...register("password", { required: "Password is required" })}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm cursor-pointer text-gray-500">
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-black"
            />
            <label className="text-sm">Remember me</label>
          </div>

          <p className="text-xs text-gray-500">
            By continuing, you agree to the{" "}
            <a href="#" className="text-blue-600 underline">
              Terms of use
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
            .
          </p>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full font-medium hover:bg-gray-800">
            Log in
          </button>

          <div className="text-center mt-4 text-sm">
            <a href="#" className="block text-black underline mb-2">
              Forgot your password
            </a>
            <span>
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 underline">
                Sign up
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
