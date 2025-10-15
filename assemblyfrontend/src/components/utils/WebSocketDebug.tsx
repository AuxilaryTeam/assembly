// src/components/WebSocketDebug.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  RefreshCw,
  Crown,
  Radio,
  X,
  Minus,
  Server,
  Signal,
  SignalHigh,
  SignalZero,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Link2,
} from "lucide-react";
import { useState } from "react";
import { useAttendance } from "./AttendanceContext";

export const WebSocketDebug = () => {
  const {
    isConnected,
    isAttendanceEnabled,
    canToggleAttendance,
    connectionState,
    reconnect,
    connectionUrl,
  } = useAttendance();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Only show debug component for admin users
  if (!canToggleAttendance || !isVisible) {
    return null;
  }

  const handleReconnect = async () => {
    setIsReconnecting(true);
    await reconnect();
    setTimeout(() => setIsReconnecting(false), 2000);
  };

  const getConnectionConfig = () => {
    switch (connectionState) {
      case "CONNECTED":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-500",
          borderColor: "border-emerald-200",
          icon: <SignalHigh className="w-4 h-4" />,
          statusIcon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
          text: "Connected",
          description: "Live connection established",
          pulse: true,
        };
      case "CONNECTING":
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-500",
          borderColor: "border-amber-200",
          icon: <RefreshCw className="w-4 h-4 animate-spin" />,
          statusIcon: <Clock className="w-4 h-4 text-amber-500" />,
          text: "Connecting",
          description: "Establishing connection...",
          pulse: false,
        };
      case "DISCONNECTED":
        return {
          color: "text-rose-600",
          bgColor: "bg-rose-500",
          borderColor: "border-rose-200",
          icon: <SignalZero className="w-4 h-4" />,
          statusIcon: <AlertCircle className="w-4 h-4 text-rose-500" />,
          text: "Disconnected",
          description: "No connection to server",
          pulse: false,
        };
      default:
        return {
          color: "text-slate-600",
          bgColor: "bg-slate-500",
          borderColor: "border-slate-200",
          icon: <AlertCircle className="w-4 h-4" />,
          statusIcon: <AlertCircle className="w-4 h-4 text-slate-500" />,
          text: "Unknown",
          description: "Connection state unknown",
          pulse: false,
        };
    }
  };

  const connection = getConnectionConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="fixed top-4 right-4 z-50 font-sans"
      >
        {/* Compact Mode - Clean Professional Design */}
        {!isExpanded && (
          <motion.button
            layout
            className={`
              group relative flex items-center gap-3 px-4 py-2.5 rounded-xl
              bg-white border transition-all duration-200
              shadow-sm hover:shadow-md cursor-pointer
              ${connection.borderColor} border
              hover:scale-105 active:scale-95
            `}
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Status Indicator */}
            <div className="relative">
              <div
                className={`
                w-3 h-3 rounded-full border border-white
                ${connection.bgColor} ${connection.pulse ? "animate-pulse" : ""}
              `}
              />
            </div>

            {/* Status Text */}
            <div className="flex flex-col items-start">
              <span className={`text-sm font-medium ${connection.color}`}>
                {connection.text}
              </span>
              <span className="text-xs text-slate-500">
                {isAttendanceEnabled ? "Active" : "Paused"}
              </span>
            </div>

            {/* Admin Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded border border-amber-200">
              <Crown className="w-3 h-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">ADMIN</span>
            </div>
          </motion.button>
        )}

        {/* Expanded Mode - Clean Professional Card */}
        {isExpanded && (
          <motion.div
            layout
            className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden min-w-[320px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-custom-yellow rounded-lg">
                    <Server className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      Connection Monitor
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Real-time WebSocket status
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReconnect}
                    disabled={isReconnecting}
                    className={`
                      p-1.5 rounded transition-all duration-200
                      ${
                        isReconnecting
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                      }
                    `}
                    title="Reconnect"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isReconnecting ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-all duration-200"
                    title="Minimize"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Cards */}
            <div className="p-4 space-y-3">
              {/* Connection URL */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-600" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 text-sm">
                      WebSocket URL
                    </h4>
                    <p className="text-slate-600 text-xs truncate font-mono bg-white px-2 py-1 rounded border border-slate-200 mt-1">
                      {connectionUrl}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              <div
                className={`rounded-lg border ${connection.borderColor} p-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded border">
                      {connection.statusIcon}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm">
                        Connection
                      </h4>
                      <p className="text-slate-600 text-xs">
                        {connection.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${connection.color}`}
                    >
                      {connection.text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Status */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                      flex items-center justify-center w-8 h-8 rounded border
                      ${
                        isAttendanceEnabled
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-slate-100 border-slate-300"
                      }
                    `}
                    >
                      <Radio
                        className={`w-4 h-4 ${
                          isAttendanceEnabled
                            ? "text-emerald-500"
                            : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm">
                        Attendance
                      </h4>
                      <p className="text-slate-600 text-xs">
                        {isAttendanceEnabled
                          ? "Active tracking"
                          : "Tracking paused"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${
                      isAttendanceEnabled
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-300"
                    }
                  `}
                  >
                    {isAttendanceEnabled ? "LIVE" : "PAUSED"}
                  </div>
                </div>
              </div>

              {/* Admin Status */}
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded border border-amber-200">
                      <Shield className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 text-sm">
                        Access Level
                      </h4>
                      <p className="text-amber-600 text-xs">
                        Administrative privileges
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">
                      ADMIN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4">
              <button
                onClick={handleReconnect}
                disabled={isReconnecting}
                className={`
                  w-full flex items-center justify-center gap-2 px-3 py-2 
                  rounded-lg text-sm font-medium transition-all duration-200
                  border
                  ${
                    isReconnecting
                      ? "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed"
                      : "bg-custom-yellow text-white border-amber-600 hover:bg-amber-600 active:scale-95"
                  }
                `}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isReconnecting ? "animate-spin" : ""
                  }`}
                />
                {isReconnecting ? "Reconnecting..." : "Reconnect"}
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <Wifi className="w-3 h-3" />
                  <span>WebSocket Monitor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${connection.bgColor} ${
                      connection.pulse ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="text-slate-500 font-medium">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WebSocketDebug;
