import { useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPrinter,
  FiFileText,
  FiMonitor,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiCheckSquare,
  FiClipboard,
  FiX,
  FiUsers,
  FiGrid,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { BsBarChartLine, BsCardChecklist } from "react-icons/bs";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Logo.png";
import slogan from "@/assets/logo2.jpg";
import collapsedLogo from "@/assets/logo-collapsed.ico";
import { BookOpen, CheckCircle, ShieldAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAttendance } from "./utils/AttendanceContext";

// Define types for navigation items
interface ToggleItem {
  name: string;
  icon: React.ReactElement;
  action: () => void;
  isToggle: true;
}

interface NavItem {
  name: string;
  icon: React.ReactElement;
  path: string;
  isToggle?: never;
}

type NavigationItem = ToggleItem | NavItem;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAttendanceEnabled, toggleAttendance } = useAttendance();
  const [sidebarState, setSidebarState] = useState("expanded");

  // Define attendance toggle item
  const attendanceToggleItem: ToggleItem = {
    name: `Attendance ${isAttendanceEnabled ? "ON" : "OFF"}`,
    icon: isAttendanceEnabled ? (
      <FiToggleRight className="text-green-500" />
    ) : (
      <FiToggleLeft className="text-gray-500" />
    ),
    action: toggleAttendance,
    isToggle: true,
  };

  // Navigation items with toggle at the top
  const navItems: NavigationItem[] = [
    attendanceToggleItem,
    { name: "Attendance", icon: <FiClipboard />, path: "/search" },
    { name: "Print Forms", icon: <FiPrinter />, path: "/searchprint" },
    {
      name: "Attendance Report",
      icon: <FiFileText />,
      path: "/attendancereport",
    },
    {
      name: " Attendance Summary Display",
      icon: <FiMonitor />,
      path: "/display",
    },
    {
      name: "Print Attendance Summary ",
      icon: <BsCardChecklist />,
      path: "/displayprint",
    },
    {
      name: "Voting Screen",
      icon: <FiCheckSquare />,
      path: "/displayselector",
    },
    { name: "Dashboard", icon: <FiGrid />, path: "/dashboard" },
    { name: "Candidates", icon: <FiUsers />, path: "/candidates" },
    { name: "Print Log", icon: <BookOpen />, path: "/log" },
    {
      name: "General Reports",
      icon: <BsBarChartLine />,
      path: "/VoteReportsPage",
    },
    { name: "Print Dividend", icon: <FiPrinter />, path: "/assembly_dividend" },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("voteServiceToken");

      toast({
        variant: "success",
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Logged out successfully</span>
          </div>
        ),
        description: "You have been logged out.",
        duration: 3000,
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Logout Failed</span>
          </div>
        ),
        description: "Something went wrong while logging out.",
        duration: 4000,
      });
    }
  };

  const hideSidebar = () => {
    setSidebarState("hidden");
  };

  const expandSidebar = () => {
    setSidebarState("expanded");
  };

  // CSS classes for active/inactive navigation items
  const activeClasses = "bg-amber-50 text-custom-yellow shadow-inner";
  const inactiveClasses = "text-gray-700";

  // Type guard to check if item is a toggle item
  const isToggleItem = (item: NavigationItem): item is ToggleItem => {
    return "isToggle" in item && item.isToggle === true;
  };

  // Type guard to check if item is a nav item
  const isNavItem = (item: NavigationItem): item is NavItem => {
    return "path" in item;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarState !== "hidden" && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{
              width: sidebarState === "expanded" ? 288 : 72,
            }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex flex-col bg-white shadow-xl border-r border-gray-200 print:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar header with collapse controls */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {sidebarState === "expanded" ? (
                  <div className="flex flex-row items-left justify-around w-full">
                    <img src={logo} alt="Logo" className="h-14 w-auto" />
                    <button
                      onClick={() => setSidebarState("collapsed")}
                      className="text-gray-700 p-1 hover:bg-gray-200 rounded"
                      title="Collapse"
                    >
                      <FiChevronLeft size={28} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <img
                      src={collapsedLogo}
                      alt="Logo"
                      className="h-10 w-auto mx-auto mb-2"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSidebarState("expanded")}
                        className="text-gray-700 p-1 hover:bg-gray-200 rounded"
                        title="Expand"
                      >
                        <FiMenu size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation items */}
              <nav className="flex-1 overflow-y-auto mt-6 px-2 space-y-2">
                {navItems.map((item) => {
                  const commonClasses = `flex items-center p-4 text-base font-semibold rounded-lg transition-colors ${
                    sidebarState === "collapsed" ? "justify-center" : ""
                  } ${
                    isToggleItem(item)
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                      : "hover:bg-amber-100 hover:text-amber-700 text-gray-700"
                  }`;

                  // Handle toggle button
                  if (isToggleItem(item)) {
                    return (
                      <button
                        key={item.name}
                        onClick={item.action}
                        className={commonClasses}
                        title={sidebarState === "collapsed" ? item.name : ""}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {sidebarState === "expanded" && (
                          <span className="ml-3">{item.name}</span>
                        )}
                      </button>
                    );
                  }

                  // Handle external link for display page
                  if (item.path === "/display") {
                    return (
                      <a
                        key={item.name}
                        href={`/assembly${item.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${commonClasses} ${inactiveClasses}`}
                        title={sidebarState === "collapsed" ? item.name : ""}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {sidebarState === "expanded" && (
                          <span className="ml-3">{item.name}</span>
                        )}
                      </a>
                    );
                  }

                  // Handle regular navigation links
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `${commonClasses} ${
                          isActive ? activeClasses : inactiveClasses
                        }`
                      }
                      title={sidebarState === "collapsed" ? item.name : ""}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {sidebarState === "expanded" && (
                        <span className="ml-3">{item.name}</span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Logout button at bottom */}
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="destructive"
                  className={`flex items-center justify-center ${
                    sidebarState === "collapsed" ? "w-12 px-0" : "w-full"
                  }`}
                  onClick={handleLogout}
                  title={sidebarState === "collapsed" ? "Logout" : ""}
                >
                  <FiLogOut
                    className={sidebarState === "collapsed" ? "" : "mr-2"}
                  />
                  {sidebarState === "expanded" && "Logout"}
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Expand Button (Visible when sidebar is hidden) */}
      {sidebarState === "hidden" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-4 z-50 print:hidden"
        >
          <Button
            className="bg-amber-400 hover:bg-amber-500 text-black rounded-full p-3 shadow-lg"
            onClick={expandSidebar}
          >
            <FiChevronRight size={24} />
          </Button>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md flex items-center justify-between p-6 print:hidden">
          {/* Left side: menu toggle */}
          <div className="flex items-center gap-4">
            {sidebarState === "hidden" ? (
              <div className="flex flex-row items-center w-full">
                <img src={logo} alt="Logo" className="h-14 w-auto ml-4" />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={hideSidebar}
                className="text-gray-700 p-1 hover:bg-gray-200 rounded"
                title="Hide Sidebar"
              >
                <FiX size={38} />
              </Button>
            )}
          </div>

          {/* Right side: slogan or logo */}
          <div className="flex items-center gap-2">
            <img src={slogan} alt="Brand Slogan" className="h-10 w-auto" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Card className="shadow-lg border border-gray-100 rounded-xl">
            <CardContent>
              <Outlet />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
