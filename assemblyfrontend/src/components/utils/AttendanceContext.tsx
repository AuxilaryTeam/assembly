// utils/AttendanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AttendanceContextType {
  isAttendanceEnabled: boolean;
  toggleAttendance: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAttendanceEnabled, setIsAttendanceEnabled] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("attendanceEnabled");
    if (saved !== null) {
      setIsAttendanceEnabled(JSON.parse(saved));
    }
  }, []);

  const toggleAttendance = () => {
    const newState = !isAttendanceEnabled;
    setIsAttendanceEnabled(newState);
    localStorage.setItem("attendanceEnabled", JSON.stringify(newState));
  };

  return (
    <AttendanceContext.Provider
      value={{ isAttendanceEnabled, toggleAttendance }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
