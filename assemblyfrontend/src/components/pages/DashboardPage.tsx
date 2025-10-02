import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVoteYea, FaExclamationCircle, FaBriefcase } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const pages = [
    {
      name: "Elections",
      description: "Manage and view all active elections",
      icon: <FaVoteYea className="text-[#f1ab15] h-8 w-8" />,
      path: "/elections",
    },
    {
      name: "Issues",
      description: "View and create issues for discussion",
      icon: <FaExclamationCircle className="text-[#f1ab15] h-8 w-8" />,
      path: "/issues",
    },
    {
      name: "Positions",
      description: "Manage positions for elections",
      icon: <FaBriefcase className="text-[#f1ab15] h-8 w-8" />,
      path: "/positions",
    },
  ];

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description:
          "Failed to navigate to the selected page. Please try again.",
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Dashboard
        </h1>
        <p className="text-gray-600 text-center">
          Navigate to manage elections, issues, or positions
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div
              key={page.name}
              onClick={() => handleNavigation(page.path)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-[#f1ab1544] transition cursor-pointer flex flex-col items-center">
              <div className="mb-4">{page.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {page.name}
              </h2>
              <p className="text-gray-600 text-center text-sm">
                {page.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
