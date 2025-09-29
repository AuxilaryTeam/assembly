import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { FiPrinter, FiRefreshCw } from "react-icons/fi";
import logo from "@/assets/Logo.png";
import slogan from "@/assets/logo2.jpg";
import { useToast } from "@/hooks/use-toast";
import GenericPrint from "../print/GenericPrint";
import { useReactToPrint } from "react-to-print";

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
  const printRef = useRef(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const fetchAttendanceCount = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBase}admin/countp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  }, [apiBase, token, toast]);

  const fetchSumSubscription = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBase}admin/sumsub`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  }, [apiBase, token, toast]);

  const fetchVotingSum = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBase}admin/sumvoting`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  }, [apiBase, token, toast]);

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
      }
    } catch (err) {
      console.error("Error updating data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAttendanceCount, fetchSumSubscription, fetchVotingSum]);

  const postVoteLog = async (voteLog: VoteLogType) => {
    try {
      const response = await axios.post(`${apiBase}admin/printlog`, voteLog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page { margin: 0 !important; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; }
        .slogan-image { height: 32px !important; width: auto !important; }
        .logo-image { height: 48px !important; width: auto !important; }
      }
    `,
    documentTitle: 'Shareholders Meeting',
    print: async (iframe) => {
      await postVoteLog({
        id: 0,
        timestamp: new Date().toISOString(),
        attendeeCount: attendanceCount,
        totalShare: sharesSum,
        attendeeShareCount: sumvoting,
      });
      iframe.contentWindow?.print();
    },
    onBeforePrint: () => new Promise((resolve) => setTimeout(resolve, 500)),
    preserveAfterPrint: true, // Debug mode, remove after testing
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const percentage =
    sharesSum > 0 ? ((sumvoting / sharesSum) * 100).toFixed(2) : "0.00";

  const meetingHeader = (
    <div className="mb-5 text-left pl-8">
      <h1 className="font-bold text-lg text-center mb-1 print:text-md">
        የአቢሲኒያ ባንክ የባለአክሲዮኖች ስብሰባ
      </h1>
    </div>
  );

  const TimeDateDetail = (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 text-sm">
      <div></div>
      <div>
        <p>
          <span className="font-semibold">የስብሰባ ቀን:</span>{" "}
          {new Date().toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">የታተመበት ሰዓት (print time):</span>{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );

  const metricsContent = (
    <div className="max-w-4xl mx-auto mb-4 pl-5 pr-5 pt-6 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        <div className="p-4 rounded-lg border border-gray-200 overflow-hidden text-center print:border-2">
          <p className="text-base font-bold text-gray-700 mb-2">
            ለስብሰባ የተገኙ የባለአክሲዮኖች ብዛት
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {Intl.NumberFormat("en-US").format(attendanceCount)}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 overflow-hidden text-center print:border-2">
          <p className="text-base font-bold text-gray-700 mb-2">
            አጠቃላይ የተፈረመ አክሲዮን ካፒታል
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {Intl.NumberFormat("en-US").format(sharesSum)}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 overflow-hidden text-center print:border-2">
          <p className="text-base font-bold text-gray-700 mb-2">
            ለስብሰባ የተገኙ አክሲዮኖች (በቁጥር)
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {Intl.NumberFormat("en-US").format(sumvoting)}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 overflow-hidden text-center print:border-2">
          <p className="text-base font-bold text-gray-700 mb-2">
            ለስብሰባ የተገኙ አክሲዮኖች (%)
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {percentage}%
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:min-h-0 print:overflow-hidden">
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
              onClick={handlePrint}
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

      <div ref={printRef} className="break-before-page">
        <GenericPrint
          documentType="display"
          TimeDateDetail={TimeDateDetail}
          header={meetingHeader}
        >
          {metricsContent}
        </GenericPrint>
      </div>
    </div>
  );
};

export default DisplayPrint;