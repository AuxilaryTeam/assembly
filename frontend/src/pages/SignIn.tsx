import SignInForm from "../components/forms/SiginInForm";

import { SystemTitle } from "../components/utils/modules";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-gray-100 px-4">
      <div className="max-w-5xl flex w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side: SignIn Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </h2>
          <SignInForm />
        </div>

        {/* Right Side: Logo and Text */}
        <SystemTitle />
      </div>
    </div>
  );
};

export default SignIn;
