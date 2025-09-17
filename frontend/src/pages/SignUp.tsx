import SignUpForm from "../components/forms/SignUpForm";
import BoALogo from "../assets/react.svg";
import { SystemTitle } from "../components/utils/modules";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-gray-100 px-4">
      <div className="max-w-5xl flex w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side: SignUp Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-center text-2xl font-semibold mb-6">
            Create an account
          </h2>
          <SignUpForm />
        </div>

        {/* Right Side: Logo and Text */}
        <SystemTitle />
      </div>
    </div>
  );
};

export default SignUp;
