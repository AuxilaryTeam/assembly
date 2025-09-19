import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, ArrowLeft, LayoutGrid, LayoutList } from "lucide-react";

/**
 * Interface for the CountUpComponent props to ensure type safety.
 */
interface CountUpComponentProps {
  start: number;
  end: number;
  duration: number;
  decimals: number;
  suffix: string;
}

/**
 * Custom component to animate a number count.
 * @param {CountUpComponentProps} props
 */
const CountUpComponent = ({
  start,
  end,
  duration,
  decimals,
  suffix,
}: CountUpComponentProps) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const targetCount = end;
      const delta = targetCount - start;

      if (progress < duration * 1000) {
        const easedProgress = Math.min(1, progress / (duration * 1000));
        const newCount = start + delta * easedProgress;
        setCount(newCount);
        requestAnimationFrame(animateCount);
      } else {
        setCount(targetCount);
      }
    };

    const animationFrameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, start, duration]);

  const formattedCount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(count);

  return (
    <span>
      {formattedCount}
      {suffix}
    </span>
  );
};

const Display = () => {
  const navigate = useNavigate();
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [prevAttendanceCount, setPrevAttendanceCount] = useState(0);

  const [sumVoting, setSumVoting] = useState(0);
  const [prevSumVoting, setPrevSumVoting] = useState(0);

  const [sharesSum, setSharesSum] = useState(0);
  const [prevSharesSum, setPrevSharesSum] = useState(0);

  const [prevPercentage, setPrevPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState("list");

  const { toast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    setPrevPercentage((prevSumVoting / prevSharesSum) * 100 || 0);
  }, [sumVoting, sharesSum]);

  const fetchAttendanceCount = async () => {
    console.log(
      `[${new Date().toLocaleString()}] Starting fetch for attendance count...`
    );
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/countp`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrevAttendanceCount(attendanceCount);
      setAttendanceCount(response.data);
      console.log(
        `[${new Date().toLocaleString()}] Attendance count fetched successfully: ${
          response.data
        }`
      );
      return true;
    } catch (err) {
      console.error(
        `[${new Date().toLocaleString()}] Error fetching attendance count:`,
        err
      );
      toast({
        title: "Data Update Failed",
        description: "Could not fetch attendance count",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchSumSubscription = async () => {
    console.log(
      `[${new Date().toLocaleString()}] Starting fetch for sum subscription...`
    );
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/sumsub`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrevSharesSum(sharesSum);
      setSharesSum(response.data);
      console.log(
        `[${new Date().toLocaleString()}] Sum subscription fetched successfully: ${
          response.data
        }`
      );
      return true;
    } catch (err) {
      console.error(
        `[${new Date().toLocaleString()}] Error fetching sum subscription:`,
        err
      );
      toast({
        title: "Data Update Failed",
        description: "Could not fetch subscription data",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchVotingSum = async () => {
    console.log(
      `[${new Date().toLocaleString()}] Starting fetch for voting sum...`
    );
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/sumvoting`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrevSumVoting(sumVoting);
      setSumVoting(response.data);
      console.log(
        `[${new Date().toLocaleString()}] Voting sum fetched successfully: ${
          response.data
        }`
      );
      return true;
    } catch (err) {
      console.error(
        `[${new Date().toLocaleString()}] Error fetching voting sum:`,
        err
      );
      toast({
        title: "Data Update Failed",
        description: "Could not fetch voting data",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchData = async () => {
    if (!token) {
      console.warn(
        `[${new Date().toLocaleString()}] No authentication token found. Skipping fetch.`
      );
      toast({
        title: "Authentication Error",
        description: "No token found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    console.log(
      `[${new Date().toLocaleString()}] Starting full data fetch cycle...`
    );
    setIsLoading(true);
    const results = await Promise.allSettled([
      fetchAttendanceCount(),
      fetchSumSubscription(),
      fetchVotingSum(),
    ]);

    const allSuccessful = results.every(
      (result) => result.status === "fulfilled" && result.value === true
    );

    if (allSuccessful) {
      console.log(
        `[${new Date().toLocaleString()}] All data fetched successfully.`
      );
      toast({
        title: "Data Updated",
        description: "All metrics refreshed successfully",
        variant: "default",
      });
    } else {
      console.warn(
        `[${new Date().toLocaleString()}] Some fetches failed during cycle.`
      );
    }
    setIsLoading(false);
    console.log(`[${new Date().toLocaleString()}] Data fetch cycle completed.`);
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 45 seconds
    }, 45000);

    return () => {
      console.log(
        `[${new Date().toLocaleString()}] Cleaning up interval timer.`
      );
      clearInterval(interval);
    };
  }, []);

  const percentage = sharesSum > 0 ? (sumVoting / sharesSum) * 100 : 0;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center font-sans">
      <Card className="w-full h-[90vh] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 pb-2 sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Button
                variant="outline"
                onClick={() => navigate("/report")}
                className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={fetchData}
                className="flex items-center gap-2">
                <RefreshCcw size={18} />
                Refresh
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="flex items-center gap-2">
                {viewMode === "grid" ? (
                  <LayoutList size={18} />
                ) : (
                  <LayoutGrid size={18} />
                )}
                Toggle View
              </Button>
              {isLoading && (
                <div className="h-4 w-4 rounded-full bg-amber-500 animate-pulse"></div>
              )}
              <span className="text-gray-500 font-semibold">
                Auto-updating every 45s
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pt-0 flex-grow overflow-y-auto no-scrollbar">
          <div
            className={`gap-8 md:gap-12 ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2"
                : "flex flex-col"
            }`}>
            {/* Attendance Count Metric */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-amber-100 opacity-60 rounded-bl-full"></div>
              <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                ለስብሰባ የተገኙ የባለአክሲዮኖች ብዛት
              </p>
              <p className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-none">
                <CountUpComponent
                  start={prevAttendanceCount}
                  end={attendanceCount}
                  duration={1.5}
                  decimals={0}
                  suffix=""
                />
              </p>
              <div className="mt-6 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-amber-500 rounded-full"
                  style={{
                    width: `${Math.min((attendanceCount / 1000) * 100, 100)}%`,
                  }}></div>
              </div>
            </div>

            {/* Subscribed Shares Metric */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-amber-100 opacity-60 rounded-bl-full"></div>
              <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                አጠቃላይ የተፈረመ አክሲዮን ካፒታል (በቁጥር)
              </p>
              <p className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-none">
                <CountUpComponent
                  start={prevSharesSum}
                  end={sharesSum}
                  duration={1.5}
                  decimals={0}
                  suffix=""
                />
              </p>
              <div className="mt-6 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-amber-500 rounded-full"
                  style={{
                    width: `${Math.min((sharesSum / 10000000) * 100, 100)}%`,
                  }}></div>
              </div>
            </div>

            {/* Attended Subscribed Shares Metric */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-amber-100 opacity-60 rounded-bl-full"></div>
              <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                የተገኙ ባለአክሲዮኖች የተፈረመ አክሲዮን መጠን (በቁጥር)
              </p>
              <p className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-none">
                <CountUpComponent
                  start={prevSumVoting}
                  end={sumVoting}
                  duration={1.5}
                  decimals={0}
                  suffix=""
                />
              </p>
              <div className="mt-6 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-amber-500 rounded-full"
                  style={{
                    width: `${Math.min((sumVoting / 10000000) * 100, 100)}%`,
                  }}></div>
              </div>
            </div>

            {/* Percentage Metric */}
            <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 opacity-70 rounded-bl-full"></div>
              <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                የተገኙ ባለአክሲዮኖች የተፈረመ አክሲዮን መጠን (በ%)
              </p>
              <p className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-none">
                <CountUpComponent
                  start={prevPercentage}
                  end={percentage}
                  duration={1.5}
                  decimals={2}
                  suffix="%"
                />
              </p>
              <div className="mt-6 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-amber-500 rounded-full"
                  style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        {/* Status Bar */}
        <div className="p-6 pt-0 sticky bottom-0 bg-white border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <div
                className={`h-4 w-4 rounded-full ${
                  isLoading ? "bg-amber-500 animate-pulse" : "bg-green-500"
                } mr-3`}></div>
              <span className="text-md md:text-lg font-semibold text-gray-700">
                {isLoading ? "Updating data..." : "System status: Normal"}
              </span>
            </div>
            <span className="text-sm md:text-lg text-gray-500">
              Last update: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Display;
