import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FiPrinter, FiRefreshCw } from "react-icons/fi";
import logo from "@/assets/Logo.png";
import slogan from "@/assets/logo2.jpg";
import { useToast } from "@/hooks/use-toast";

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
        toast({
          title: "Data Updated",
          description: "Meeting statistics updated successfully",
        });
      }
    } catch (err) {
      console.error("Error updating data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAttendanceCount, fetchSumSubscription, fetchVotingSum, toast]);

  const printDocument = () => {
    toast({
      title: "Preparing Document",
      description: "The official meeting document is being prepared for printing",
    });

    setTimeout(() => {
      window.print();
    }, 300);
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
              onClick={printDocument}
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
            <div>
              <h1 className="text-xl font-bold text-gray-900">አቢሲኒያ ባንክ</h1>
              <p className="text-md text-gray-700">የባለአክሲዮኖች ጉባኤ</p>
            </div>
          </div>
          <img
            src={slogan}
            alt="Bank of Abyssinia Slogan"
            className="h-10 w-auto"
          />
        </div>

        {/* Meeting Details */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <span className="font-semibold">የስብሰባ ቀን:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">የስብሰባ መለያ:</span> BOA-SH-2023-001
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">ሰነድ የተጻፈበት ቀን:</span>{" "}
              {new Date().toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">ያጸደቀው ባለሥልጣን:</span> የጉባኤ ፀሃፊ
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

        {/* Signatures Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div
              className="border-t-2 border-gray-400 pt-4 mx-auto"
              style={{ width: "80%" }}
            >
              <p className="font-semibold">የጉባኤው ፕሬዚደንት</p>
              <p className="text-sm text-gray-600">ስም እና ፊርማ</p>
            </div>
          </div>
          <div className="text-center">
            <div
              className="border-t-2 border-gray-400 pt-4 mx-auto"
              style={{ width: "80%" }}
            >
              <p className="font-semibold">የጉባኤው ፀሃፊ</p>
              <p className="text-sm text-gray-600">ስም እና ፊርማ</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 border-t pt-4">
          <p>ይህ የባንክ አቢሲኒያ ባንክ - የባለአክሲዮኖች ጉባኤ ኦፊሴላዊ ሰነድ ነው</p>
          <p>
            ቀን {new Date().toLocaleString()} | የሰነድ መለያ:{" "}
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Print Instructions (Hidden when printing) */}
      <div className="print:hidden mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 max-w-4xl mx-auto">
        <h3 className="font-bold text-yellow-800 mb-2">
          Printing Instructions:
        </h3>
        <ul className="list-disc list-inside text-yellow-700 text-sm">
          <li>
            Click "Print Official Document" to generate a printable version
          </li>
          <li>
            Ensure the document includes all borders and background colors in
            print preview
          </li>
          <li>Use quality paper for official records</li>
          <li>
            Have both the Chairperson and Secretary sign the document after
            printing
          </li>
          <li>
            File this document as an official record of the shareholders meeting
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DisplayPrint;