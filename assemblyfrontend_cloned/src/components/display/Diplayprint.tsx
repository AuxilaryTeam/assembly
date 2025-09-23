import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FiPrinter, FiRefreshCw } from "react-icons/fi";
import logo from "@/assets/Logo.png";
import slogan from "@/assets/logo2.jpg";
import { useToast } from "@/hooks/use-toast";

export interface VoteLogType {
  id: number;
  timestamp: string;
  attendeeCount: number;
  totalShare: number;
  attendeeShareCount: number;
}

const DisplayPrint = () => {
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [sumvoting, setSumvoting] = useState(0);
  const [sharesSum, setSharesSum] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const fetchAttendanceCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/countp`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceCount(response.data);
      return true;
    } catch (err) {
      console.error("Error fetching attendance count:", err);
      toast({
        title: "Data Fetch Failed",
        description: "Could not retrieve attendance count",
        variant: "destructive",
      });
      return false;
    }
  }, [token, toast]);

  const fetchSumSubscription = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/sumsub`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSharesSum(response.data);
      return true;
    } catch (err) {
      console.error("Error fetching subscribed shares sum:", err);
      toast({
        title: "Data Fetch Failed",
        description: "Could not retrieve subscribed shares data",
        variant: "destructive",
      });
      return false;
    }
  }, [token, toast]);

  const fetchVotingSum = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/sumvoting`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSumvoting(response.data);
      return true;
    } catch (err) {
      console.error("Error fetching voting shares sum:", err);
      toast({
        title: "Data Fetch Failed",
        description: "Could not retrieve voting shares data",
        variant: "destructive",
      });
      return false;
    }
  }, [token, toast]);

  const fetchData = useCallback(async () => {
    try {
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
        setLastUpdated(new Date().toLocaleString());
        // toast({
        //   title: "Data Updated",
        //   description: "Meeting statistics updated successfully",
        // });
      }
    } catch (err) {
      console.error("Error updating data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAttendanceCount, fetchSumSubscription, fetchVotingSum, toast]);

  const postVoteLog = async (voteLog: VoteLogType) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}admin/printlog`,
        voteLog,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handlePrint = () => {
    // Log the vote data to the server
    postVoteLog({
      id: 0,
      timestamp: new Date().toISOString(),
      attendeeCount: attendanceCount,
      totalShare: sharesSum,
      attendeeShareCount: sumvoting,
    });

    // // Show a toast that the document is being prepared for printing
    // toast({
    //   title: "Preparing Document",
    //   description:
    //     "The official meeting document is being prepared for printing",
    // });

    // Wait a brief moment to allow the toast to show, then trigger the print dialog
    window.print();
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  const percentage =
    sharesSum > 0 ? ((sumvoting / sharesSum) * 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Control Panel (Hidden when printing) */}
      <div className="print:hidden mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            Shareholders Meeting - Official Document
          </h1>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Updating..." : "Refresh Data"}
            </button>
            <button
              onClick={handlePrint} // Call the new handlePrint function
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiPrinter />
              Print Official Document
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Last updated: {lastUpdated || "Never"} | Data refreshes automatically
          every 15 seconds
        </p>
      </div>

      {/* Printable Document */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-2 border-gray-300 print:border-0 print:shadow-none">
        {/* Bank Letterhead */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-6">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Bank of Abyssinia Logo"
              className="h-16 w-auto mr-4"
            />
          </div>
          <img
            src={slogan}
            alt="Bank of Abyssinia Slogan"
            className="h-10 w-auto"
          />
        </div>

        {/* Meeting Details */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-32 text-sm">
          <div></div>
          <div>
            <p>
              <span className="font-semibold">የታተመበት (print) ቀን:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">ሰዓት (time):</span>{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Official Statistics in the new card-like layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Attendance Count Metric */}
          <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
            <p className="text-base font-bold text-gray-700 mb-2">
              ለስብሰባ የተገኙ የባለአክሲዮኖች ብዛት
            </p>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {Intl.NumberFormat("en-US").format(attendanceCount)}
            </p>
          </div>

          {/* Subscribed Shares Metric */}
          <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
            <p className="text-base font-bold text-gray-700 mb-2">
              አጠቃላይ የተፈረመ አክሲዮን ካፒታል
            </p>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {Intl.NumberFormat("en-US").format(sharesSum)}
            </p>
          </div>

          {/* Attended Subscribed Shares Metric */}
          <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
            <p className="text-base font-bold text-gray-700 mb-2">
              የተገኙ አክሲዮኖች (በቁጥር)
            </p>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {Intl.NumberFormat("en-US").format(sumvoting)}
            </p>
          </div>

          {/* Percentage Metric */}
          <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
            <p className="text-base font-bold text-gray-700 mb-2">
              የተገኙ አክሲዮኖች (%)
            </p>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPrint;
