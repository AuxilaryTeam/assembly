import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import {
  FiGrid,
  FiCalendar,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiList,
} from "react-icons/fi";

import { isAuthenticated } from "../utils/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface Customer {
  customerId: number;
  customerName: string;
  netBalance: number;
  t24Id: number;
}

const headerLink = ({
  to,
  children,
}: {
  to: string;
  children: string | React.ReactNode;
}) => (
  <Link to={to} className="text-gray-400 hover:text-[#f1ab15]">
    {children}
  </Link>
);

const dropdownLink = ({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-base text-gray-900">
    <Icon className="w-4 h-4" />
    {label}
  </Link>
);

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [search, setSearch] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchDropDown, setSearchDropDown] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // inside Header component (replace current useEffect)
  const controllerRef = useRef<AbortController | null>(null);
  const MIN_SEARCH_LENGTH = 1;

  // useEffect(() => {
  //   let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  //   if (!search || search.trim().length < MIN_SEARCH_LENGTH) {
  //     // cancel any running request
  //     if (controllerRef.current) {
  //       controllerRef.current.abort();
  //       controllerRef.current = null;
  //     }
  //     setCustomers([]);
  //     setLoading(false);
  //     return;
  //   }

  //   setLoading(true);

  //   debounceTimer = setTimeout(() => {
  //     // cancel previous request if any
  //     if (controllerRef.current) {
  //       controllerRef.current.abort();
  //     }

  //     const controller = new AbortController();
  //     controllerRef.current = controller;

  //     const doSearch = async () => {
  //       try {
  //         // if your searchCustomers accepts config, pass the signal:
  //         const res = await searchCustomers(search.trim());
  //         // normalize response shape
  //         const payload = res?.data;
  //         console.log("Search results:", payload);
  //         if (Array.isArray(payload)) {
  //           setCustomers(payload);
  //         } else if (
  //           payload &&
  //           typeof payload === "object" &&
  //           Object.keys(payload).length > 0
  //         ) {
  //           setCustomers([payload]);
  //         } else {
  //           setCustomers([]);
  //         }
  //       } catch (error: any) {
  //         // If request was aborted, avoid treating it as an error
  //         // Axios aborted error may have name 'CanceledError' or code 'ERR_CANCELED'
  //         const isCanceled =
  //           error?.name === "CanceledError" ||
  //           error?.code === "ERR_CANCELED" ||
  //           (error?.message && error.response.data.error.includes("not found"));

  //         if (!isCanceled) {
  //           console.error("Error fetching customers:", error);
  //           toast.error("Failed to fetch customers");
  //           setCustomers([]);
  //         }
  //       } finally {
  //         // only stop loading if the current controller is still this one
  //         if (controllerRef.current === controller) {
  //           setLoading(false);
  //           controllerRef.current = null;
  //         }
  //       }
  //     };

  //     void doSearch();
  //   }, 200);

  //   // cleanup: clear debounce and optionally cancel outstanding request when component unmounts or search changes
  //   return () => {
  //     if (debounceTimer) clearTimeout(debounceTimer);
  //     // don't abort here — abort is handled at the top when starting a new request
  //   };
  // }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit or other defaults
      if (customers.length === 1) {
        navigate(`/customerinfo/${customers[0].customerId}`);
        setSearch(""); // optionally clear search input
        setSearchDropDown(false); // close dropdown
      }
    }
  };

  return (
    <header className="sticky w-full top-0 z-50 px-4 py-2 shadow h-fit bg-white">
      <div className="flex w-full md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left side: Logo and Navigation */}
        <div className="flex items-center md:gap-6">
          {/* Burger menu button (only on small screens) */}
          {isAuthenticated() && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 focus:outline-none">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          )}

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="absolute top-17 left-0 w-56 bg-white border rounded-md shadow-md z-50 flex flex-col lg:hidden">
              {dropdownLink({
                to: "/",
                icon: FiGrid, // Replace with relevant icon like FiHome if desired
                label: "Dashboard",
                onClick: () => setIsMobileMenuOpen(false),
              })}
              {dropdownLink({
                to: "/weeklyinput",
                icon: FiCalendar, // Replace with relevant icon
                label: "Weekly Input",
                onClick: () => setIsMobileMenuOpen(false),
              })}
              {dropdownLink({
                to: "/report",
                icon: FiBarChart2, // Replace with relevant icon
                label: "Report",
                onClick: () => setIsMobileMenuOpen(false),
              })}

              {user !== null &&
                user.roleName === "ADMIN" &&
                dropdownLink({
                  to: "/authorize",
                  icon: FiCheckCircle,
                  label: "Authorize",
                  onClick: () => setIsMobileMenuOpen(false),
                })}

              {dropdownLink({
                to: "/proceeds",
                icon: FiList,
                label: "Proceeds Processing",
                onClick: () => setIsMobileMenuOpen(false),
              })}

              {dropdownLink({
                to: "/profile",
                icon: FiUser,
                label: "Profile",
                onClick: () => setShowUserDropdown(false),
              })}
              {dropdownLink({
                to: "/settings",
                icon: FiSettings,
                label: "Settings",
                onClick: () => setShowUserDropdown(false),
              })}
              {dropdownLink({
                to: "/signin",
                icon: FiLogOut,
                label: "Logout",
                onClick: () => {
                  localStorage.removeItem("token");
                  setShowUserDropdown(false);
                },
              })}
            </div>
          )}

          <Link to="/">
            <img
              src="/import-export/BOA_logo.svg"
              alt="Logo of bank of abyssinia"
              className="h-14"
            />
          </Link>
          {isAuthenticated() && (
            <div className="relative">
              {/* Desktop nav links */}
              <nav className="hidden lg:flex items-center gap-5">
                {headerLink({ to: "/", children: "Dashboard" })}
                {headerLink({ to: "/weeklyinput", children: "Weekly Input" })}
                {headerLink({ to: "/report", children: "Report" })}

                {user !== null &&
                  user.roleName === "ADMIN" &&
                  headerLink({ to: "/authorize", children: "Authorize" })}
                {headerLink({
                  to: "/proceeds",
                  children: "Proceeds Processing",
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Right side: Search, Profile, Auth */}
        <div className="relative flex items-center gap-4">
          {!["/signin", "/signup"].includes(currentPath) && (
            <>
              {/* Search bar */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-[#f1ab15]" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchDropDown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setSearchDropDown(false);
                    }, 300);
                  }}
                  onKeyDown={handleKeyDown} // add this
                  placeholder="Search by ID or Name..."
                  className="pl-10 pr-4 py-2 border border-[#f1ab15] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1ab15] w-64"
                />

                {/* Search dropdown as card */}
                {search && searchDropDown && (
                  <div className="absolute z-20 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-60">
                    {loading ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : customers.length ? (
                      customers.map((customer) => (
                        <Link
                          key={customer.customerId}
                          to={`/customerinfo/${customer.customerId}`}
                          onClick={() => setSearch("")}
                          className="block px-4 py-3 hover:bg-gray-50">
                          <div className="text-sm font-medium text-gray-800">
                            {customer.customerName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {customer.customerId}
                          </div>
                          <div className="text-xs text-gray-500">
                            T24 ID: {customer.t24Id}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-400 text-sm">
                        No users found.
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Notification Icon */}
              {/* <DevNotificationPanel /> */}

              {/* User Icon */}
              <div ref={userDropdownRef} className="relative hidden md:flex">
                <img
                  src="/import-export/icons/Account.svg"
                  alt="User Account"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="h-8 w-8 cursor-pointer rounded-full"
                />

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-20">
                    {dropdownLink({
                      to: "/profile",
                      icon: FiUser,
                      label: "Profile",
                      onClick: () => setShowUserDropdown(false),
                    })}
                    {dropdownLink({
                      to: "/settings",
                      icon: FiSettings,
                      label: "Settings",
                      onClick: () => setShowUserDropdown(false),
                    })}
                    {dropdownLink({
                      to: "/signin",
                      icon: FiLogOut,
                      label: "Logout",
                      onClick: () => {
                        localStorage.removeItem("token");
                        setShowUserDropdown(false);
                      },
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {currentPath === "/signup" && (
            <Link to="/signin">
              <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-[#f1ab15] hover:text-white transition">
                Sign In
              </button>
            </Link>
          )}
          {currentPath === "/signin" && (
            <Link to="/signup">
              <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-[#f1ab15] hover:text-white transition">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
