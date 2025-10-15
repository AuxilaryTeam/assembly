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
import {
  BookOpen,
  CheckCircle,
  ShieldAlert,
  Circle,
  Radio,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAttendance } from "./utils/AttendanceContext";
import { UserRole } from "./utils/types";

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

interface StatusItem {
  name: string;
  icon: React.ReactElement;
  isStatus: true;
}

type NavigationItem = ToggleItem | NavItem | StatusItem;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const {
    isAttendanceEnabled,
    toggleAttendance,
    canToggleAttendance,
    isConnected,
  } = useAttendance();
  const [sidebarState, setSidebarState] = useState("expanded");
  const userRole = localStorage.getItem("userRole") as UserRole;
  const isAdmin = userRole === "ADMIN";

  // Enhanced toggle function with better UX
  const handleToggleAttendance = () => {
    if (!canToggleAttendance) return;

    toggleAttendance();

    // Enhanced toast notification
    toast({
      title: (
        <div className="flex items-center gap-2">
          {isAttendanceEnabled ? (
            <PowerOff className="h-5 w-5 text-amber-600" />
          ) : (
            <Power className="h-5 w-5 text-green-600" />
          )}
          <span className="font-medium">
            Attendance {isAttendanceEnabled ? "Disabled" : "Enabled"}
          </span>
        </div>
      ),
      description: isConnected
        ? `Attendance tracking is now ${isAttendanceEnabled ? "OFF" : "ON"}`
        : "⚠️ No connection to attendance service",
      duration: 3000,
      variant: isConnected ? "default" : "destructive",
    });
  };

  // Professional toggle button component
  const AttendanceToggleButton = () => (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isAttendanceEnabled
                ? "bg-green-50 border border-green-200"
                : "bg-slate-100 border border-slate-300"
            }`}
          >
            {isAttendanceEnabled ? (
              <Power className="w-5 h-5 text-green-600" />
            ) : (
              <PowerOff className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 text-sm">
              Attendance System
            </span>
            <span className="text-slate-600 text-xs">
              {isAttendanceEnabled ? "Active tracking" : "System paused"}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleAttendance}
          disabled={!isConnected}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:ring-offset-2
            ${isAttendanceEnabled ? "bg-green-500" : "bg-slate-400"}
            ${
              !isConnected
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:shadow-md"
            }
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200
              ${isAttendanceEnabled ? "translate-x-6" : "translate-x-1"}
              shadow-sm
            `}
          />
        </button>
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className={isConnected ? "text-green-700" : "text-red-700"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <span
          className={`
          px-2 py-1 rounded text-xs font-medium
          ${
            isAttendanceEnabled
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-slate-100 text-slate-600 border border-slate-300"
          }
        `}
        >
          {isAttendanceEnabled ? "LIVE" : "PAUSED"}
        </span>
      </div>
    </div>
  );

  // Admin toggle item with professional UI
  // const adminToggleItem: ToggleItem | null = isAdmin
  //   ? {
  //       name: `Attendance Control`,
  //       icon: (
  //         <div className="relative">
  //           {isAttendanceEnabled ? (
  //             <Power className="w-5 h-5 text-green-600" />
  //           ) : (
  //             <PowerOff className="w-5 h-5 text-slate-500" />
  //           )}
  //         </div>
  //       ),
  //       action: handleToggleAttendance,
  //       isToggle: true,
  //     }
  //   : null;

  // Professional status indicator for non-admin users
  const attendanceStatusItem: StatusItem | null = !isAdmin
    ? {
        name: `Attendance Status`,
        icon: (
          <div className="relative">
            <div
              className={`p-2 rounded-lg ${
                isAttendanceEnabled
                  ? isConnected
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-slate-100 text-slate-500 border border-slate-300"
              }`}
            >
              {isAttendanceEnabled ? (
                <div className="relative">
                  <Power className="w-5 h-5" />
                  {isConnected && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              ) : (
                <PowerOff className="w-5 h-5" />
              )}
            </div>
          </div>
        ),
        isStatus: true,
      }
    : null;

  const adminNavItems = [
    { name: "Dashboard", icon: <FiGrid />, path: "/dashboard" },
    {
      name: "Voting Screen",
      icon: <FiCheckSquare />,
      path: "/displayselector",
    },
    {
      name: "General Reports",
      icon: <BsBarChartLine />,
      path: "/VoteReportsPage",
    },
    {
      name: "Print Attendance Summary",
      icon: <BsCardChecklist />,
      path: "/displayprint",
    },
    { name: "Print Log", icon: <BookOpen />, path: "/log" },
  ];

  // Navigation items with appropriate items based on user role
  const navItems: NavigationItem[] = [
    // Show admin toggle or user status indicator
    // ...(adminToggleItem ? [adminToggleItem] : []),
    ...(attendanceStatusItem ? [attendanceStatusItem] : []),

    // Common navigation items
    { name: "Attendance", icon: <FiClipboard />, path: "/search" },
    { name: "Print Forms", icon: <FiPrinter />, path: "/searchprint" },
    {
      name: "Attendance Report",
      icon: <FiFileText />,
      path: "/attendancereport",
    },
    {
      name: "Attendance Summary Display",
      icon: <FiMonitor />,
      path: "/display",
    },
    { name: "Candidates", icon: <FiUsers />, path: "/candidates" },
    { name: "Print Dividend", icon: <FiPrinter />, path: "/assembly_dividend" },

    // Admin-only items
    ...(isAdmin ? adminNavItems : []),
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
  const activeClasses =
    "bg-amber-50 text-custom-yellow border border-amber-200";
  const inactiveClasses = "text-slate-700 hover:bg-slate-50";

  // Type guards
  const isToggleItem = (item: NavigationItem): item is ToggleItem => {
    return "isToggle" in item && item.isToggle === true;
  };

  const isStatusItem = (item: NavigationItem): item is StatusItem => {
    return "isStatus" in item && item.isStatus === true;
  };

  const isNavItem = (item: NavigationItem): item is NavItem => {
    return "path" in item;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
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
            className="hidden md:flex flex-col bg-white shadow-sm border-r border-slate-200 print:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar header with collapse controls */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                {sidebarState === "expanded" ? (
                  <div className="flex flex-row items-left justify-around w-full">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                    <button
                      onClick={() => setSidebarState("collapsed")}
                      className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Collapse"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <img
                      src={collapsedLogo}
                      alt="Logo"
                      className="h-8 w-auto mx-auto mb-2"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSidebarState("expanded")}
                        className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Expand"
                      >
                        <FiMenu size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation items */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* Professional toggle button for admin */}
                {isAdmin && (
                  <div className="mb-4">
                    <AttendanceToggleButton />
                  </div>
                )}

                {navItems.map((item) => {
                  const commonClasses = `flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    sidebarState === "collapsed" ? "justify-center" : ""
                  } ${
                    isToggleItem(item)
                      ? "bg-white border border-slate-200 text-slate-800 cursor-pointer hover:shadow-sm"
                      : isStatusItem(item)
                      ? "bg-slate-50 text-slate-700 cursor-default border border-slate-200"
                      : "hover:bg-slate-50 text-slate-700"
                  }`;

                  // Handle admin toggle button
                  if (isToggleItem(item)) {
                    return (
                      <button
                        key={item.name}
                        onClick={item.action}
                        className={`${commonClasses} group relative`}
                        title={sidebarState === "collapsed" ? item.name : ""}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {sidebarState === "expanded" && (
                          <div className="ml-3 text-left flex-1">
                            <div className="font-semibold text-slate-900">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              <div className="flex items-center gap-1">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isConnected ? "bg-green-500" : "bg-red-500"
                                  }`}
                                />
                                {isAttendanceEnabled ? "Active" : "Inactive"}
                              </div>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  }

                  // Handle status indicator for non-admin users
                  if (isStatusItem(item)) {
                    return (
                      <div
                        key={item.name}
                        className={commonClasses}
                        title={sidebarState === "collapsed" ? item.name : ""}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {sidebarState === "expanded" && (
                          <div className="ml-3 text-left flex-1">
                            <div className="font-semibold text-slate-900">
                              {item.name}
                            </div>
                            <div
                              className={`text-xs font-medium mt-1 ${
                                isAttendanceEnabled
                                  ? isConnected
                                    ? "text-green-600"
                                    : "text-amber-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {isAttendanceEnabled ? "Active" : "Inactive"}
                              {isConnected ? " • Connected" : " • Disconnected"}
                            </div>
                          </div>
                        )}
                      </div>
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
                        <span className="text-lg">{item.icon}</span>
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
                      <span className="text-lg">{item.icon}</span>
                      {sidebarState === "expanded" && (
                        <span className="ml-3">{item.name}</span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Logout button at bottom */}
              <div className="p-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  className={`flex items-center justify-center ${
                    sidebarState === "collapsed" ? "w-12 px-0" : "w-full"
                  } text-slate-700 border-slate-300 hover:bg-slate-50`}
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
            className="bg-custom-yellow text-white rounded-lg p-3 shadow-sm hover:bg-amber-500"
            onClick={expandSidebar}
          >
            <FiChevronRight size={20} />
          </Button>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm flex items-center justify-between p-4 print:hidden">
          {/* Left side: menu toggle */}
          <div className="flex items-center gap-4">
            {sidebarState === "hidden" ? (
              <div className="flex flex-row items-center w-full">
                <img src={logo} alt="Logo" className="h-10 w-auto ml-4" />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={hideSidebar}
                className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg"
                title="Hide Sidebar"
              >
                <FiX size={24} />
              </Button>
            )}
          </div>

          {/* Right side: slogan and attendance status indicator for non-admin users */}
          <div className="flex items-center gap-4">
            {!isAdmin && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  isAttendanceEnabled
                    ? isConnected
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-100 text-slate-600 border-slate-300"
                }`}
              >
                <div className="relative">
                  {isAttendanceEnabled ? (
                    <>
                      <Power className="w-4 h-4" />
                      {isConnected && (
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </>
                  ) : (
                    <PowerOff className="w-4 h-4" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  Attendance {isAttendanceEnabled ? "ON" : "OFF"}
                  {isConnected ? " • Connected" : " • Disconnected"}
                </span>
              </div>
            )}
            <img src={slogan} alt="Brand Slogan" className="h-8 w-auto" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Card className="shadow-sm border border-slate-200 rounded-lg m-4">
            <CardContent className="p-6">
              <Outlet />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
