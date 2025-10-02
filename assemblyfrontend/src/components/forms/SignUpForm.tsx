import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SignUpForm } from "../utils/types"; // Adjust the import path as necessary
import { userSignUp } from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Adjust the import path as necessary

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpForm) => {
    // console.log("Form submitted", data);
    const userData = {
      firstName: data.firstName,
      middleName: "", // Assuming middleName is optional, you can adjust as needed
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      roleId: 1,
      username: data.username,
    };

    try {
      const response = await userSignUp(userData);
      console.log("Sign up successful", response.data);
      toast.success("Sign up successful", response.data);
      navigate("/signin");
    } catch (error: any) {
      console.error("Sign up failed", error.response.data);
      toast.error(`Error: ${error.response.data.message}`);
    }
  };

  return (
    <div className="flex w-fit ">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full border rounded px-3 py-2 focus:outline-none"
            {...register("firstName", { required: "Full name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border rounded px-3 py-2 focus:outline-none"
            {...register("lastName", { required: "Last Name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}

          <input
            type="text"
            placeholder="User Name"
            className="w-full border rounded px-3 py-2 focus:outline-none"
            {...register("lastName", { required: "Last Name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}

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

          <p className="text-xs text-gray-500 -mt-2 mb-1">
            We strongly recommend using your organizational email. This will
            help verify your account.
          </p>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded px-3 py-2 focus:outline-none"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full border rounded px-3 py-2 focus:outline-none"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-sm cursor-pointer text-gray-500">
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500">
            By creating an account, you agree to the{" "}
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
            Sign Up
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
