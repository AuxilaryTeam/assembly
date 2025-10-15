// src/utils/AttendanceContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { nativeWebSocketService } from "./api";
import { useToast } from "@/hooks/use-toast";

interface AttendanceContextType {
  isAttendanceEnabled: boolean;
  toggleAttendance: () => void;
  canToggleAttendance: boolean;
  isConnected: boolean;
  connectionState: string;
  reconnect: () => void;
  connectionUrl: string;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAttendanceEnabled, setIsAttendanceEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState("DISCONNECTED");
  const { toast } = useToast();
  const initializedRef = useRef(false);

  const userRole = localStorage.getItem("userRole") as string;
  const canToggleAttendance = userRole === "ADMIN";

  // Get the WebSocket URL for debugging
  const connectionUrl = "ws://localhost:8082/assemblyservice/ws/attendance";

  useEffect(() => {
    // Prevent multiple initializations in development with React Strict Mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log("🔄 Initializing WebSocket connection...");

    // Initialize WebSocket connection
    nativeWebSocketService.connect();

    // Subscribe to WebSocket messages
    const unsubscribe = nativeWebSocketService.subscribe((message) => {
      switch (message.type) {
        case "STATUS":
        case "TOGGLE":
          if (message.enabled !== undefined) {
            setIsAttendanceEnabled(message.enabled);
          }
          if (message.message) {
            toast({
              variant: message.enabled ? "success" : "destructive",
              title: message.enabled
                ? "✅ Attendance Enabled"
                : "⛔ Attendance Disabled",
              description: message.message,
              duration: 3000,
            });
          }
          break;

        case "ERROR":
          toast({
            variant: "destructive",
            title: "WebSocket Error",
            description: message.message,
            duration: 4000,
          });
          break;

        case "CONNECTION_STATUS":
          setIsConnected(message.connected);
          break;

        case "AUTH_RESULT":
          // Silent authentication result
          break;
      }
    });

    // Check connection status periodically
    const connectionCheck = setInterval(() => {
      const connected = nativeWebSocketService.isConnected();
      const state = nativeWebSocketService.getConnectionState();

      setIsConnected(connected);
      setConnectionState(state);
    }, 2000);

    // Cleanup on component unmount
    return () => {
      unsubscribe();
      clearInterval(connectionCheck);
      nativeWebSocketService.disconnect();
      initializedRef.current = false;
    };
  }, [toast]);

  const toggleAttendance = () => {
    if (!canToggleAttendance) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only administrators can toggle attendance.",
        duration: 4000,
      });
      return;
    }

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Cannot toggle attendance - no connection to server.",
        duration: 4000,
      });
      return;
    }

    nativeWebSocketService.toggleAttendance();
  };

  const reconnect = () => {
    toast({
      variant: "default",
      title: "Reconnecting...",
      description: "Attempting to reconnect to server",
      duration: 2000,
    });

    nativeWebSocketService.disconnect();
    setTimeout(() => {
      nativeWebSocketService.connect();
    }, 1000);
  };

  const contextValue: AttendanceContextType = {
    isAttendanceEnabled,
    toggleAttendance,
    canToggleAttendance,
    isConnected,
    connectionState,
    reconnect,
    connectionUrl,
  };

  return (
    <AttendanceContext.Provider value={contextValue}>
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
