import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FiPrinter,
  FiDownload,
  FiFileText,
  FiRefreshCw,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios, { AxiosError } from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/Logo.png";
import slogan from "../../assets/logo2.jpg";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { BASE_URL, getActivePositions } from "../utils/api";

interface VotedCandidate {
  Vote: number;
  candidateName: string;
  voteId: number;
}

interface VoterHistoryResponse {
  shareholderId: string;
  voterId: number;
  nameEng: string;
  votedCandidates: VotedCandidate[];
}

interface CandidateInfoResponse {
  candidateId: number;
  candidateName: string;
  totalVotes: number;
  numberOfVoters: number;
  electionDate: string;
  voters: Array<{
    voterId: number;
    shareholderId: string;
    voterName: string;
    shares: number;
  }>;
}

interface SummaryResponse {
  totalVoters: number;
  position: string;
  electionDate: string;
  totalVotes: number;
  rankings: Array<{
    candidate: string;
    totalVotes: number;
    rank: number;
    candidateId: number;
  }>;
}

interface EnhancedError {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  timestamp: string;
  suggestion?: string;
}

interface Position {
  id: number;
  name: string;
}

const GenericPrint = ({
  children,
  reportType,
  reportDate,
  currentPage,
  totalPages,
  positionName,
}: {
  children: React.ReactNode;
  reportType: string;
  reportDate: string;
  currentPage?: number;
  totalPages?: number;
  positionName?: string;
}) => (
  <div className="print:p-8 p-4 bg-white">
    <div className="flex justify-between items-center mb-4 print:mb-2 border-b-2 border-gray-300 pb-4 print:pb-2">
      <div className="flex items-center">
        <img src={logo} alt="Bank Logo" className="h-14 mr-3 print:h-12" />
        <div>
          {positionName && (
            <p className="text-sm text-gray-600">{positionName}</p>
          )}
        </div>
      </div>
      <img src={slogan} alt="Bank Slogan" className="h-10 print:h-8" />
    </div>
    <div className="mb-4 print:mb-2">
      <h2 className="text-lg font-semibold text-center border-b border-black pb-1">
        {reportType}
      </h2>
      <div className="flex justify-between text-sm">
        <span>PAGE: {currentPage || 1}</span>
        <span>DATE: {reportDate}</span>
      </div>
    </div>
    {children}
    {currentPage && totalPages && (
      <div className="mt-4 text-center text-xs text-gray-500 print:mt-2">
        Page {currentPage} of {totalPages}
      </div>
    )}
  </div>
);

const PageBreak = () => (
  <div className="page-break" style={{ pageBreakAfter: "always" }} />
);

const ErrorDisplay = ({
  error,
  onRetry,
  positionId,
}: {
  error: EnhancedError;
  onRetry: () => void;
  positionId: string;
}) => {
  const getErrorDetails = () => {
    switch (error.status) {
      case 404:
        return {
          title: "404 - Resource Not Found",
          icon: "🔍",
          description:
            "The requested resource could not be found on the server.",
          suggestions: [
            `Check if Position ID "${positionId}" is correct`,
            "Verify the position exists in the system",
            "Contact administrator if the issue persists",
          ],
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case 403:
        return {
          title: "403 - Access Denied",
          icon: "🚫",
          description: "You don't have permission to access this resource.",
          suggestions: [
            "Check your authentication token",
            "Verify your user permissions",
            "Contact administrator for access",
          ],
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case 401:
        return {
          title: "401 - Unauthorized",
          icon: "🔐",
          description: "Your session has expired or credentials are invalid.",
          suggestions: [
            "Please log in again",
            "Check your authentication token",
            "Refresh the page and try again",
          ],
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case 500:
        return {
          title: "500 - Server Error",
          icon: "⚙️",
          description: "The server encountered an unexpected error.",
          suggestions: [
            "Try again in a few moments",
            "Check if the server is running",
            "Contact technical support",
          ],
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
      default:
        return {
          title: "Connection Error",
          icon: "🔌",
          description: "Could not connect to the server.",
          suggestions: [
            "Check your internet connection",
            "Verify the server URL is correct",
            "Try again later",
          ],
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div
      className={`p-6 ${details.bgColor} ${details.borderColor} border-2 rounded-lg`}
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{details.icon}</div>
        <h2 className={`text-2xl font-bold mb-2 ${details.color}`}>
          {details.title}
        </h2>
        <p className="text-gray-700 mb-4">{details.description}</p>
        {error.status && (
          <div className="inline-block bg-white px-3 py-1 rounded border text-sm mb-4">
            <span className="font-mono">
              HTTP {error.status} {error.statusText || ""}
            </span>
          </div>
        )}
      </div>
      {error.url && (
        <div className="mb-4 p-3 bg-white rounded border">
          <p className="text-sm text-gray-600 mb-1">Request URL:</p>
          <code className="text-xs break-all">{error.url}</code>
        </div>
      )}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <FiInfo className="mr-2" />
          Suggested Solutions:
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {details.suggestions.map((suggestion, index) => (
            <li key={index} className="text-gray-700">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center space-y-3">
        <Button
          onClick={onRetry}
          className="flex items-center space-x-2 mx-auto"
          variant="outline"
        >
          <FiRefreshCw />
          <span>Try Again</span>
        </Button>
        <div className="text-xs text-gray-500">
          Error occurred at: {new Date(error.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

interface ReportViewerProps {
  reportType: string;
  reportDate: string;
  positionId: string;
  candidateId?: string;
  voterData: VoterHistoryResponse[];
  summaryData: SummaryResponse | null;
  candidateData: CandidateInfoResponse[];
  loading: boolean;
  error: EnhancedError | null;
  setVoterData: React.Dispatch<React.SetStateAction<VoterHistoryResponse[]>>;
  setSummaryData: React.Dispatch<React.SetStateAction<SummaryResponse | null>>;
  setCandidateData: React.Dispatch<
    React.SetStateAction<CandidateInfoResponse[]>
  >;
  setError: React.Dispatch<React.SetStateAction<EnhancedError | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportViewer = ({
  reportType,
  reportDate,
  positionId,
  candidateId,
  voterData,
  summaryData,
  candidateData,
  loading,
  error,
  setVoterData,
  setSummaryData,
  setCandidateData,
  setError,
  setLoading,
}: ReportViewerProps) => {
  const { toast } = useToast();

  const createEnhancedError = (err: any): EnhancedError => {
    const enhancedError: EnhancedError = {
      message: err.message || "An unexpected error occurred",
      status: err.response?.status,
      statusText: err.response?.statusText,
      url: err.config?.url,
      timestamp: new Date().toISOString(),
    };
    if (err.response?.status === 404) {
      enhancedError.suggestion = `The position with ID "${positionId}" was not found. Please verify the Position ID and try again.`;
    } else if (err.response?.status === 403) {
      enhancedError.suggestion =
        "You may not have permission to access this resource. Contact the administrator.";
    } else if (err.response?.status === 401) {
      enhancedError.suggestion =
        "Authentication failed. Please check your credentials or log in again.";
    } else if (err.request) {
      enhancedError.suggestion =
        "Please check your internet connection and try again.";
    }
    return enhancedError;
  };

  const fetchData = async () => {
    if (!positionId) {
      const validationError: EnhancedError = {
        message: "Position ID is required",
        timestamp: new Date().toISOString(),
        suggestion: "Please select a valid Position ID to generate the report.",
      };
      setError(validationError);
      toast({
        variant: "destructive",
        title: "Missing Position ID",
        description: "Select a valid position ID.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("voteServiceToken");
    if (!token) {
      const authError: EnhancedError = {
        message: "Authentication token not found",
        timestamp: new Date().toISOString(),
        suggestion: "Please log in again to continue.",
      };
      setError(authError);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "No authentication token found. Please log in again.",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const voterResponse = await axios.get(
        `${BASE_URL}/voter-history/by-position`,
        { ...config, params: { positionId } }
      );

      if (!Array.isArray(voterResponse.data)) {
        console.error("Invalid voter data format:", voterResponse.data);
        const formatError: EnhancedError = {
          message: "Invalid data format from server",
          timestamp: new Date().toISOString(),
          suggestion:
            "The server returned data in an unexpected format. Please contact support.",
        };
        setError(formatError);
        toast({
          variant: "destructive",
          title: "Data Error",
          description: "Invalid data format received from the server.",
        });
        return;
      }

      setVoterData(voterResponse.data);

      if (reportType === "Summary of Vote Result") {
        const summaryResponse = await axios.get(
          `${BASE_URL}/candidates/rankings/position/${positionId}`,
          config
        );
        setSummaryData(summaryResponse.data);
      } else {
        setSummaryData(null);
      }

      if (reportType === "Detail Vote Result by Candidates") {
        if (!candidateId) {
          setCandidateData([]);
          return;
        }

        const candidateIds = new Set<number>();
        candidateIds.add(parseInt(candidateId));

        const candidatePromises = Array.from(candidateIds).map((id) =>
          axios.get(
            `${BASE_URL}/candidates/${id}/position/${positionId}/info`,
            config
          )
        );

        const candidateResponses = await Promise.allSettled(candidatePromises);

        const candidates = candidateResponses
          .map((r, index) => {
            if (r.status !== "fulfilled") {
              console.error(
                `Failed to fetch candidate ${Array.from(candidateIds)[index]}:`,
                r.reason
              );
              return null;
            }
            const apiData = r.value.data;
            const id = Array.from(candidateIds)[index];
            return {
              candidateId: id,
              candidateName: apiData.candidate || `Candidate ${id}`,
              totalVotes: apiData.totalVotes || 0,
              numberOfVoters: apiData.numberOfVoters || 0,
              electionDate: apiData.electionDate || new Date().toISOString(),
              voters:
                apiData["list of voters"]?.map((voter: any, idx: number) => ({
                  voterId: idx + 1,
                  shareholderId:
                    voter.shareholderId ||
                    `SH${(idx + 1).toString().padStart(4, "0")}`,
                  voterName: voter.voter || `Voter ${idx + 1}`,
                  shares: voter.votePower || 0,
                })) || [],
            };
          })
          .filter((c): c is CandidateInfoResponse => c !== null);

        setCandidateData(candidates);
      } else {
        setCandidateData([]);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      const enhancedError = createEnhancedError(err);
      setError(enhancedError);
      if (err.response?.status === 404) {
        toast({
          variant: "destructive",
          title: "Position Not Found",
          description: `No data found for Position ID: ${positionId}`,
        });
      } else if (err.response?.status === 403) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You may not have permission to access this resource.",
        });
      } else if (err.response?.status === 401) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description:
            "Authentication failed. Please check your credentials or log in again.",
        });
        if (err.response?.data?.error === "invalid_token") {
          localStorage.removeItem("voteServiceToken");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: enhancedError.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType && positionId) {
      fetchData();
    }
  }, [reportType, positionId, candidateId]);

  const renderVoterReport = (voterData: VoterHistoryResponse[]) => {
    const itemsPerPage = 20;
    const totalPages = Math.ceil(voterData.length / itemsPerPage);

    if (!voterData.length) {
      return (
        <GenericPrint
          reportType="Detail Vote Result by Voters"
          reportDate={reportDate}
        >
          <div className="text-center py-8">No voter data available.</div>
        </GenericPrint>
      );
    }

    return Array.from({ length: totalPages }).map((_, pageIndex) => (
      <div key={pageIndex}>
        {pageIndex > 0 && <PageBreak />}
        <GenericPrint
          reportType="Detail Vote Result by Voters"
          reportDate={reportDate}
          currentPage={pageIndex + 1}
          totalPages={totalPages}
        >
          <Table className="border border-gray-400">
            <TableHeader>
              <TableRow className="border border-gray-400">
                <TableHead className="border border-gray-400 px-2 py-1 text-center w-20">
                  VOTER ID
                </TableHead>
                <TableHead className="border border-gray-400 px-2 py-1 text-center">
                  VOTER NAME
                </TableHead>
                <TableHead className="border border-gray-400 px-2 py-1 text-center w-48">
                  CANDIDATES VOTED FOR
                </TableHead>
                <TableHead className="border border-gray-400 px-2 py-1 text-center w-20">
                  VOTE
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voterData
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((voter: VoterHistoryResponse) => (
                  <TableRow
                    key={voter.voterId}
                    className="border border-gray-400"
                  >
                    <TableCell className="border border-gray-400 px-2 py-1 text-center font-medium">
                      {voter.shareholderId}
                    </TableCell>
                    <TableCell className="border border-gray-400 px-2 py-1 font-medium">
                      {voter.nameEng}
                    </TableCell>
                    <TableCell className="border border-gray-400 px-2 py-1 font-medium">
                      {voter.votedCandidates.length ? (
                        <div className="space-y-1">
                          {voter.votedCandidates.map(
                            (candidate: VotedCandidate, idx: number) => (
                              <div
                                key={idx}
                                className="flex justify-between font-medium"
                              >
                                <span>{candidate.candidateName}</span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No Vote</span>
                      )}
                    </TableCell>
                    <TableCell className="border border-gray-400 px-2 py-1 font-medium">
                      {voter.votedCandidates.length ? (
                        <div className="space-y-1">
                          {voter.votedCandidates.map(
                            (candidate: VotedCandidate, idx: number) => (
                              <div key={idx} className="flex justify-between">
                                <span className="font-medium">
                                  {candidate.Vote?.toLocaleString() || "N/A"}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-xs text-center border-t border-gray-400 pt-2">
            • Record {voterData.length} •
          </div>
        </GenericPrint>
      </div>
    ));
  };

  const renderCandidateReport = (candidateData: CandidateInfoResponse[]) => {
    if (!candidateId) {
      return (
        <GenericPrint
          reportType="Detail Vote Result by Candidates"
          reportDate={reportDate}
        >
          <div className="text-center py-8">
            <p>Please enter a Candidate ID to view the report.</p>
          </div>
        </GenericPrint>
      );
    }

    if (!candidateData.length) {
      return (
        <GenericPrint
          reportType="Detail Vote Result by Candidates"
          reportDate={reportDate}
        >
          <div className="text-center py-8">{`No data available for candidate ID: ${candidateId}`}</div>
        </GenericPrint>
      );
    }

    return (
      <GenericPrint
        reportType="Detail Vote Result by Candidates"
        reportDate={reportDate}
      >
        <div className="space-y-6">
          {candidateData.map(
            (candidate: CandidateInfoResponse, index: number) => (
              <div key={candidate.candidateId}>
                {index > 0 && <PageBreak />}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-center">
                    {candidate.candidateName}
                  </h3>
                  <p className="text-center text-sm text-gray-600">
                    Candidate ID: {candidate.candidateId}
                  </p>
                </div>
                <Table className="border border-gray-400 w-full">
                  <TableHeader>
                    <TableRow className="border border-gray-400">
                      <TableHead className="border border-gray-400 px-2 py-1 text-center w-12">
                        No.
                      </TableHead>
                      <TableHead className="border border-gray-400 px-2 py-1 text-center">
                        Voter ID
                      </TableHead>
                      <TableHead className="border border-gray-400 px-2 py-1 text-center">
                        Voter Name
                      </TableHead>
                      <TableHead className="border border-gray-400 px-2 py-1 text-center w-24">
                        Shares
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidate.voters.length > 0 ? (
                      candidate.voters.map(
                        (
                          voter: {
                            voterId: number;
                            shareholderId: string;
                            voterName: string;
                            shares: number;
                          },
                          idx: number
                        ) => (
                          <TableRow
                            key={voter.voterId}
                            className="border border-gray-400"
                          >
                            <TableCell className="border border-gray-400 px-2 py-1 text-center">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1 text-center font-medium">
                              {voter.shareholderId}
                            </TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">
                              {voter.voterName}
                            </TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1 text-center font-medium">
                              {voter.shares.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-gray-500"
                        >
                          No voters found for this candidate
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="mt-2 text-xs text-right">
                  Number of voters: {candidate.voters.length} | TOTAL VOTE:{" "}
                  {candidate.totalVotes.toLocaleString()}
                </div>
                <div className="text-xs text-center border-t border-gray-400 pt-2">
                  • Record {candidate.voters.length}/{candidate.numberOfVoters}{" "}
                  •
                </div>
              </div>
            )
          )}
        </div>
      </GenericPrint>
    );
  };

  const renderSummaryReport = (summaryData: SummaryResponse | null) => {
    if (!summaryData || !summaryData.rankings.length) {
      return (
        <GenericPrint
          reportType="Summary of Vote Result"
          reportDate={reportDate}
        >
          <div className="text-center py-8">No summary data available.</div>
        </GenericPrint>
      );
    }

    return (
      <GenericPrint
        reportType="Summary of Vote Result"
        reportDate={reportDate}
        positionName={summaryData.position}
      >
        <Table className="border border-gray-400 w-full">
          <TableHeader>
            <TableRow className="border border-gray-400 bg-gray-100">
              <TableHead className="border border-gray-400 px-3 py-2 text-center font-semibold w-20">
                ID NO.
              </TableHead>
              <TableHead className="border border-gray-400 px-3 py-2 text-center font-semibold">
                NAME OF CANDIDATE
              </TableHead>
              <TableHead className="border border-gray-400 px-3 py-2 text-center font-semibold w-32">
                TOTAL VOTE
              </TableHead>
              <TableHead className="border border-gray-400 px-3 py-2 text-center font-semibold w-20">
                RANK
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.rankings.map((candidate) => (
              <TableRow
                key={candidate.candidateId}
                className="border border-gray-400"
              >
                <TableCell className="border border-gray-400 px-3 py-2 text-center font-medium">
                  {candidate.candidateId.toString().padStart(5, "0")}
                </TableCell>
                <TableCell className="border border-gray-400 px-3 py-2 text-sm font-medium">
                  {candidate.candidate}
                </TableCell>
                <TableCell className="border border-gray-400 px-3 py-2 text-right font-medium">
                  {candidate.totalVotes.toLocaleString()}
                </TableCell>
                <TableCell className="border border-gray-400 px-3 py-2 text-center font-medium">
                  {candidate.rank}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 p-3 bg-gray-100 border border-gray-400">
          <p className="text-right font-semibold text-lg">
            TOTAL VOTES: {summaryData.totalVotes.toLocaleString()}
          </p>
        </div>
        <div className="mt-2 text-center font-semibold">
          Total number of Voters: {summaryData.totalVoters}
        </div>
        <div className="mt-4 text-xs text-center border-t border-gray-400 pt-2">
          Election Date:{" "}
          {new Date(summaryData.electionDate).toLocaleDateString()} | Position:{" "}
          {summaryData.position}
        </div>
      </GenericPrint>
    );
  };

  const renderReportContent = (
    voterData: VoterHistoryResponse[],
    summaryData: SummaryResponse | null,
    candidateData: CandidateInfoResponse[],
    loading: boolean,
    error: EnhancedError | null
  ) => {
    if (loading)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4" />
          <p>Loading report data...</p>
          <p className="text-sm text-gray-400 mt-2">
            Position ID: {positionId}
          </p>
        </div>
      );

    if (error)
      return (
        <div className="max-w-2xl mx-auto">
          <ErrorDisplay
            error={error}
            onRetry={fetchData}
            positionId={positionId}
          />
        </div>
      );

    if (!reportType)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FiFileText className="text-4xl mb-4" />
          <p>Please select a report type to begin</p>
        </div>
      );

    if (!positionId)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FiAlertTriangle className="text-4xl mb-4 text-yellow-500" />
          <p>Position ID is required</p>
          <p className="text-sm text-gray-400 mt-2">
            Select a Position ID to generate the report
          </p>
        </div>
      );

    switch (reportType) {
      case "Detail Vote Result by Voters":
        return renderVoterReport(voterData);
      case "Detail Vote Result by Candidates":
        return renderCandidateReport(candidateData);
      case "Summary of Vote Result":
        return renderSummaryReport(summaryData);
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FiFileText className="text-4xl mb-4" />
            <p>Invalid report type selected</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {renderReportContent(
        voterData,
        summaryData,
        candidateData,
        loading,
        error
      )}
    </div>
  );
};

const VoteReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toLocaleDateString("en-GB").split("/").reverse().join("/")
  );
  const [positionId, setPositionId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionQuery, setPositionQuery] = useState("");
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [positionError, setPositionError] = useState<string | null>(null);
  const [voterData, setVoterData] = useState<VoterHistoryResponse[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [candidateData, setCandidateData] = useState<CandidateInfoResponse[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<EnhancedError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPositions() {
      try {
        const res = await getActivePositions();
        setPositions(res.data ?? []);
        setFilteredPositions(res.data ?? []);
      } catch (err: any) {
        console.error("Failed to fetch positions", err);
        setPositionError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not load positions"
        );
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load positions. Please try again.",
        });
      }
    }
    fetchPositions();
  }, []);

  useEffect(() => {
    const q = positionQuery.trim().toLowerCase();
    setFilteredPositions(
      positions.filter(
        (p) => String(p.id).includes(q) || p.name.toLowerCase().includes(q)
      )
    );
  }, [positionQuery, positions]);

  useEffect(() => {
    setPositionError(null);
  }, [positionId, positionQuery]);

  const handlePrint = () => {
    if (!selectedReport || !positionId) {
      toast({
        variant: "destructive",
        title: "Missing Input",
        description: "Please select a report type and a Position ID.",
      });
      return;
    }
    if (selectedReport === "Detail Vote Result by Candidates" && !candidateId) {
      toast({
        variant: "destructive",
        title: "Missing Candidate ID",
        description: "Please enter a Candidate ID for this report type.",
      });
      return;
    }
    const printContent = document.getElementById("report-content");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleExportPDF = async () => {
    if (!selectedReport || !positionId) {
      toast({
        variant: "destructive",
        title: "Missing Input",
        description: "Please select a report type and a Position ID.",
      });
      return;
    }

    // Check for required data based on report type
    if (selectedReport === "Detail Vote Result by Candidates" && !candidateId) {
      toast({
        variant: "destructive",
        title: "Missing Candidate ID",
        description: "Please enter a Candidate ID for this report type.",
      });
      return;
    }
    if (
      (selectedReport === "Detail Vote Result by Voters" &&
        !voterData.length) ||
      (selectedReport === "Detail Vote Result by Candidates" &&
        !candidateData.length) ||
      (selectedReport === "Summary of Vote Result" &&
        (!summaryData || !summaryData.rankings.length))
    ) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No data available to export for the selected report.",
      });
      return;
    }

    try {
      toast({
        title: "Generating PDF",
        description: `Exporting ${selectedReport} as PDF...`,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      switch (selectedReport) {
        case "Detail Vote Result by Voters":
          await exportVoterReport(pdf, voterData);
          break;
        case "Detail Vote Result by Candidates":
          await exportCandidateReport(pdf, candidateData);
          break;
        case "Summary of Vote Result":
          await exportSummaryReport(pdf, summaryData!);
          break;
        default:
          toast({
            variant: "destructive",
            title: "Export Failed",
            description: "Invalid report type selected.",
          });
          return;
      }

      const formattedDate = reportDate.replace(/\//g, "-");
      const filename = `${selectedReport.replace(
        /\s+/g,
        "_"
      )}_${positionId}_${formattedDate}.pdf`;
      pdf.save(filename);

      toast({
        title: "PDF Exported",
        description: `Successfully exported ${selectedReport} as ${filename}.`,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description:
          "An error occurred while generating the PDF. Please try again.",
      });
    }
  };
  const exportVoterReport = async (
    pdf: jsPDF,
    voterData: VoterHistoryResponse[]
  ) => {
    const itemsPerPage = 20;
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;

    const totalPages = Math.ceil(voterData.length / itemsPerPage);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageVoters = voterData.slice(
        pageIndex * itemsPerPage,
        (pageIndex + 1) * itemsPerPage
      );

      const tempContainer = document.createElement("div");
      tempContainer.style.width = `${contentWidth}mm`;
      tempContainer.style.padding = `${margin}mm`;

      // You will need to build the HTML for the page
      const pageHtml = `
      <div style="font-family: 'Arial', sans-serif; font-size: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 2px solid #ccc; padding-bottom: 1rem;">
          <div style="display: flex; align-items: center;">
            <img src="${logo}" alt="Bank Logo" style="height: 14mm; margin-right: 3mm;" />
          </div>
          <img src="${slogan}" alt="Bank Slogan" style="height: 10mm;" />
        </div>
        <div style="text-align: center; margin-bottom: 1rem; border-bottom: 1px solid black; padding-bottom: 0.5rem;">
          <h1 style="font-weight: bold; font-size: 14px;">Detail Vote Result by Voters</h1>
          <p style="font-size: 10px;">Report Date: ${reportDate}</p>
          <p style="font-size: 10px;">Page ${pageIndex + 1} of ${totalPages}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="border: 1px solid #000; background-color: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 15%;">VOTER ID</th>
              <th style="border: 1px solid #000; padding: 4px; text-align: center;">VOTER NAME</th>
              <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 30%;">CANDIDATES VOTED FOR</th>
              <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 15%;">VOTE</th>
            </tr>
          </thead>
          <tbody>
            ${pageVoters
              .map(
                (voter: VoterHistoryResponse) => `
              <tr style="border: 1px solid #000;">
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${
                  voter.shareholderId
                }</td>
                <td style="border: 1px solid #000; padding: 4px;">${
                  voter.nameEng
                }</td>
                <td style="border: 1px solid #000; padding: 4px;">
                  ${
                    voter.votedCandidates.length > 0
                      ? voter.votedCandidates
                          .map((c) => `<div>${c.candidateName}</div>`)
                          .join("")
                      : '<span style="color: gray;">No Vote</span>'
                  }
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                  ${
                    voter.votedCandidates.length > 0
                      ? voter.votedCandidates
                          .map(
                            (c) =>
                              `<div>${c.Vote?.toLocaleString() || "N/A"}</div>`
                          )
                          .join("")
                      : ""
                  }
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div style="margin-top: 10px; font-size: 8px; text-align: center; border-top: 1px solid #000; padding-top: 5px;">
          • Record ${voterData.length} •
        </div>
      </div>
    `;

      tempContainer.innerHTML = pageHtml;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

      document.body.removeChild(tempContainer);
    }
  };
  const exportCandidateReport = async (
    pdf: jsPDF,
    candidateData: CandidateInfoResponse[]
  ) => {
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;

    for (const [index, candidate] of candidateData.entries()) {
      const tempContainer = document.createElement("div");
      tempContainer.style.width = `${contentWidth}mm`;
      tempContainer.style.padding = `${margin}mm`;

      // You will need to build the HTML for the page
      const pageHtml = `
      <div style="font-family: 'Arial', sans-serif; font-size: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 2px solid #ccc; padding-bottom: 1rem;">
          <div style="display: flex; align-items: center;">
            <img src="${logo}" alt="Bank Logo" style="height: 14mm; margin-right: 3mm;" />
          </div>
          <img src="${slogan}" alt="Bank Slogan" style="height: 10mm;" />
        </div>
        <div style="text-align: center; margin-bottom: 1rem; border-bottom: 1px solid black; padding-bottom: 0.5rem;">
          <h1 style="font-weight: bold; font-size: 14px;">Detail Vote Result by Candidates</h1>
          <p style="font-size: 10px;">Report Date: ${reportDate}</p>
        </div>
        <div style="text-align: center; margin-bottom: 1rem;">
          <h3 style="font-weight: bold; font-size: 1.25rem;">${
            candidate.candidateName
          }</h3>
          <p style="font-size: 0.875rem; color: #6b7280;">Candidate ID: ${
            candidate.candidateId
          }</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border: 1px solid #000; background-color: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 10%;">No.</th>
              <th style="border: 1px solid #000; padding: 4px; text-align: center;">Voter ID</th>
              <th style="border: 1px solid #000; padding: 4px; text-align: center;">Voter Name</th>
              <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 20%;">Shares</th>
            </tr>
          </thead>
          <tbody>
            ${
              candidate.voters.length > 0
                ? candidate.voters
                    .map(
                      (voter, idx) => `
                <tr style="border: 1px solid #000;">
                  <td style="border: 1px solid #000; padding: 4px; text-align: center;">${
                    idx + 1
                  }</td>
                  <td style="border: 1px solid #000; padding: 4px; text-align: center;">${
                    voter.shareholderId
                  }</td>
                  <td style="border: 1px solid #000; padding: 4px;">${
                    voter.voterName
                  }</td>
                  <td style="border: 1px solid #000; padding: 4px; text-align: right;">${voter.shares.toLocaleString()}</td>
                </tr>
              `
                    )
                    .join("")
                : `<tr><td colspan="4" style="text-align: center; padding: 16px; color: gray;">No voters found for this candidate</td></tr>`
            }
          </tbody>
        </table>
        <div style="margin-top: 10px; font-size: 10px; text-align: right;">
          Number of voters: ${
            candidate.voters.length
          } | TOTAL VOTE: ${candidate.totalVotes.toLocaleString()}
        </div>
        <div style="margin-top: 5px; font-size: 8px; text-align: center; border-top: 1px solid #000; padding-top: 5px;">
          • Record ${candidate.voters.length} / ${candidate.numberOfVoters} •
        </div>
      </div>
    `;

      tempContainer.innerHTML = pageHtml;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      if (index > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

      document.body.removeChild(tempContainer);
    }
  };
  const exportSummaryReport = async (
    pdf: jsPDF,
    summaryData: SummaryResponse
  ) => {
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;

    const tempContainer = document.createElement("div");
    tempContainer.style.width = `${contentWidth}mm`;
    tempContainer.style.padding = `${margin}mm`;

    // You will need to build the HTML for the page
    const pageHtml = `
    <div style="font-family: 'Arial', sans-serif; font-size: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 2px solid #ccc; padding-bottom: 1rem;">
          <div style="display: flex; align-items: center;">
            <img src="${logo}" alt="Bank Logo" style="height: 14mm; margin-right: 3mm;" />
          </div>
          <img src="${slogan}" alt="Bank Slogan" style="height: 10mm;" />
        </div>
      <div style="text-align: center; margin-bottom: 1rem; border-bottom: 1px solid black; padding-bottom: 0.5rem;">
        <h1 style="font-weight: bold; font-size: 14px;">Summary of Vote Result</h1>
        <p style="font-size: 10px;">Report Date: ${reportDate}</p>
        <p style="font-size: 10px;">Position: ${summaryData.position}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border: 1px solid #000; background-color: #f2f2f2;">
            <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 15%;">ID NO.</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">NAME OF CANDIDATE</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 25%;">TOTAL VOTE</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 15%;">RANK</th>
          </tr>
        </thead>
        <tbody>
          ${summaryData.rankings
            .map(
              (candidate) => `
            <tr style="border: 1px solid #000;">
              <td style="border: 1px solid #000; padding: 4px; text-align: center;">${candidate.candidateId
                .toString()
                .padStart(5, "0")}</td>
              <td style="border: 1px solid #000; padding: 4px;">${
                candidate.candidate
              }</td>
              <td style="border: 1px solid #000; padding: 4px; text-align: right;">${candidate.totalVotes.toLocaleString()}</td>
              <td style="border: 1px solid #000; padding: 4px; text-align: center;">${
                candidate.rank
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="margin-top: 10px; padding: 8px; background-color: #f2f2f2; border: 1px solid #000;">
        <p style="text-align: right; font-weight: bold; font-size: 14px;">TOTAL VOTES: ${summaryData.totalVotes.toLocaleString()}</p>
      </div>
      <div style="margin-top: 5px; font-size: 10px; text-align: center; border-top: 1px solid #000; padding-top: 5px;">
        Total number of Voters: ${summaryData.totalVoters}
      </div>
    </div>
  `;

    tempContainer.innerHTML = pageHtml;
    document.body.appendChild(tempContainer);

    const canvas = await html2canvas(tempContainer, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

    document.body.removeChild(tempContainer);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Shareholders' General Assembly Vote Reports
        </h1>
        {positionError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-6">
            {positionError}
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="lg:w-1/4 w-full shadow-lg lg:sticky lg:top-6 lg:self-start">
            <CardHeader>
              <CardTitle className="text-lg">Report Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reportDate">Report Date</Label>
                <Input
                  id="reportDate"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="positionSelect">Position *</Label>

                <Select
                  value={positionId}
                  onValueChange={setPositionId}
                  required
                >
                  <SelectTrigger id="positionSelect">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPositions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.id} - {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedReport === "Detail Vote Result by Candidates" && (
                <div>
                  <Label htmlFor="candidateId">Candidate ID *</Label>
                  <Input
                    id="candidateId"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    placeholder="Enter specific candidate ID"
                    className="w-full"
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="reportSelect">Select Report Type *</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedReport(value);
                    setCandidateId("");
                  }}
                  value={selectedReport}
                >
                  <SelectTrigger id="reportSelect">
                    <SelectValue placeholder="Choose a report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Detail Vote Result by Voters">
                      Detail Vote Result by Voters
                    </SelectItem>
                    <SelectItem value="Detail Vote Result by Candidates">
                      Detail Vote Result by Candidates
                    </SelectItem>
                    <SelectItem value="Summary of Vote Result">
                      Summary of Vote Result
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  onClick={handlePrint}
                  disabled={
                    !selectedReport ||
                    !positionId ||
                    (selectedReport === "Detail Vote Result by Candidates" &&
                      !candidateId)
                  }
                  className="flex items-center space-x-2"
                >
                  <FiPrinter />
                  <span>Print Report</span>
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={
                    !selectedReport ||
                    !positionId ||
                    (selectedReport === "Detail Vote Result by Candidates" &&
                      !candidateId)
                  }
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <FiDownload />
                  <span>Export as PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-lg">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <div id="report-content">
                <ReportViewer
                  reportType={selectedReport}
                  reportDate={reportDate}
                  positionId={positionId}
                  candidateId={candidateId}
                  voterData={voterData}
                  summaryData={summaryData}
                  candidateData={candidateData}
                  loading={loading}
                  error={error}
                  setVoterData={setVoterData}
                  setSummaryData={setSummaryData}
                  setCandidateData={setCandidateData}
                  setError={setError}
                  setLoading={setLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-content, #report-content * { visibility: visible; }
          #report-content { position: absolute; left: 0; top: 0; width: 100%; background: white; }
          .no-print { display: none !important; }
          .page-break { page-break-after: always; }
          @page { size: A4; margin: 15mm; }
          table { border-collapse: collapse; width: 100%; font-size: 10pt; }
          th, td { border: 1px solid black; padding: 4px 8px; }
          img { max-width: 100%; height: auto; }
        }
        @media screen and (min-width: 1024px) {
          .lg\\:sticky { position: sticky; top: 1.5rem; z-index: 10; }
          .lg\\:self-start { align-self: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default VoteReportsPage;
