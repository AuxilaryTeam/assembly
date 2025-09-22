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
import { FiPrinter, FiDownload, FiFileText, FiRefreshCw } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import logo from "../../assets/Logo.png";
import slogan from "../../assets/logo2.jpg";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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

const apiBase = "http://localhost:8081/api/";

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

const ReportViewer = ({
  reportType,
  reportDate,
  positionId,
  candidateId,
}: {
  reportType: string;
  reportDate: string;
  positionId: string;
  candidateId?: string;
}) => {
  const [voterData, setVoterData] = useState<VoterHistoryResponse[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [candidateData, setCandidateData] = useState<CandidateInfoResponse[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!positionId) {
      setError("Please enter a position ID");
      toast({
        variant: "destructive",
        title: "Missing Position ID",
        description: "Enter a valid position ID.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    // Get token from localStorage
    const token = localStorage.getItem("voteServiceToken");
    console.log("Token from storage:", token);

    if (!token) {
      setError("Authentication failed. Please log in.");
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
      // Fetch voter history
      const voterResponse = await axios.get(
        `${apiBase}voter-history/by-position`,
        {
          ...config,
          params: { positionId },
        }
      );

      console.log("Response received:", voterResponse.data);

      if (!Array.isArray(voterResponse.data)) {
        console.error("Invalid voter data format:", voterResponse.data);
        setError("Invalid data format from server.");
        return;
      }

      setVoterData(voterResponse.data);

      // Handle summary report
      if (reportType === "Summary of Vote Result") {
        const summaryResponse = await axios.get(
          `${apiBase}candidates/rankings/position/${positionId}`,
          config
        );
        setSummaryData(summaryResponse.data);
      } else {
        setSummaryData(null);
      }

      // Handle candidate detail report
      if (reportType === "Detail Vote Result by Candidates") {
        const candidateIds = new Set<number>();

        // If specific candidate ID is provided, use only that candidate
        if (candidateId) {
          candidateIds.add(parseInt(candidateId));
        } else {
          // Otherwise, get all candidate IDs from the voter data
          voterResponse.data.forEach((voter: VoterHistoryResponse) => {
            voter.votedCandidates.forEach((candidate) => {
              candidateIds.add(candidate.voteId); // Using voteId as candidate ID
            });
          });
        }

        if (candidateIds.size === 0) {
          setCandidateData([]);
          return;
        }

        const candidatePromises = Array.from(candidateIds).map((id) =>
          axios.get(
            `${apiBase}candidates/${id}/position/${positionId}/info`,
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

      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        console.error("Response headers:", err.response.headers);
      }

      if (err.response?.status === 403) {
        setError("Access Denied: Invalid or expired authentication token.");
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Your session may have expired. Please log in again.",
        });
        localStorage.removeItem("voteServiceToken");
      } else if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to continue.",
        });
        localStorage.removeItem("voteServiceToken");
      } else if (err.request) {
        setError("Network Error: Could not connect to the server.");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Please check your internet connection and try again.",
        });
      } else {
        setError("An unexpected error occurred.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
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

  const renderVoterReport = () => {
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
                .map((voter) => (
                  <TableRow
                    key={voter.voterId}
                    className="border border-gray-400"
                  >
                    <TableCell className="border border-gray-400 px-2 py-1 text-center  font-medium">
                      {voter.shareholderId}
                    </TableCell>
                    <TableCell className="border border-gray-400 px-2 py-1 font-medium">
                      {voter.nameEng}
                    </TableCell>
                    <TableCell className="border border-gray-400 px-2 py-1 font-medium">
                      {voter.votedCandidates.length ? (
                        <div className="space-y-1">
                          {voter.votedCandidates.map((candidate, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between font-medium"
                            >
                              <span>{candidate.candidateName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No Vote</span>
                      )}
                    </TableCell>
                    <TableCell className="border border-gray-400 px-2 py-1 font-medium">
                      {voter.votedCandidates.length ? (
                        <div className="space-y-1">
                          {voter.votedCandidates.map((candidate, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="font-medium">
                                {candidate.Vote?.toLocaleString() || "N/A"}
                              </span>
                            </div>
                          ))}
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

  const renderCandidateReport = () => {
    if (!candidateData.length) {
      return (
        <GenericPrint
          reportType="Detail Vote Result by Candidates"
          reportDate={reportDate}
        >
          <div className="text-center py-8">
            {candidateId
              ? `No data available for candidate ID: ${candidateId}`
              : "No candidate data available."}
          </div>
        </GenericPrint>
      );
    }

    return (
      <GenericPrint
        reportType="Detail Vote Result by Candidates"
        reportDate={reportDate}
      >
        <div className="space-y-6">
          {candidateData.map((candidate, index) => (
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
                    candidate.voters.map((voter, idx) => (
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
                    ))
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
                • Record {candidate.voters.length}/{candidate.numberOfVoters} •
              </div>
            </div>
          ))}
        </div>
      </GenericPrint>
    );
  };

  const renderSummaryReport = () => {
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

  const renderReportContent = () => {
    if (loading)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4" />
          <p>Loading...</p>
        </div>
      );
    if (error)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <FiFileText className="text-4xl mb-4" />
          <p className="text-center mb-4">{error}</p>
          <div className="flex space-x-2">
            <Button onClick={fetchData} className="flex items-center space-x-2">
              <FiRefreshCw />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      );
    if (!reportType)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FiFileText className="text-4xl mb-4" />
          <p>Please select a report.</p>
        </div>
      );
    if (!positionId)
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FiFileText className="text-4xl mb-4" />
          <p>Please enter a Position ID.</p>
        </div>
      );

    switch (reportType) {
      case "Detail Vote Result by Voters":
        return renderVoterReport();
      case "Detail Vote Result by Candidates":
        return renderCandidateReport();
      case "Summary of Vote Result":
        return renderSummaryReport();
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FiFileText className="text-4xl mb-4" />
            <p>Invalid report type.</p>
          </div>
        );
    }
  };

  return <div className="p-6">{renderReportContent()}</div>;
};

const VoteReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toLocaleDateString("en-GB").split("/").reverse().join("/")
  );
  const [positionId, setPositionId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const { toast } = useToast();

  const handlePrint = () => {
    if (!selectedReport || !positionId) {
      toast({
        variant: "destructive",
        title: "Missing Input",
        description: "Select a report type and position ID.",
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

  const handleExportPDF = () => {
    if (!selectedReport || !positionId) {
      toast({
        variant: "destructive",
        title: "Missing Input",
        description: "Select a report type and position ID.",
      });
      return;
    }
    toast({
      title: "Exporting PDF",
      description: `Exporting ${selectedReport} as PDF.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Shareholders' General Assembly Vote Reports
        </h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="lg:w-1/4 w-full shadow-lg">
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
                <Label htmlFor="positionId">Position ID *</Label>
                <Input
                  id="positionId"
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  placeholder="Enter position ID (e.g., 2)"
                  className="w-full"
                  required
                />
              </div>

              {selectedReport === "Detail Vote Result by Candidates" && (
                <div>
                  <Label htmlFor="candidateId">Candidate ID (Optional)</Label>
                  <Input
                    id="candidateId"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    placeholder="Enter specific candidate ID"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to show all candidates
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="reportSelect">Select Report Type *</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedReport(value);
                    setCandidateId(""); // Reset candidate ID when report type changes
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
                  disabled={!selectedReport || !positionId}
                  className="flex items-center space-x-2"
                >
                  <FiPrinter />
                  <span>Print Report</span>
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={!selectedReport || !positionId}
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
            <CardContent>
              <div id="report-content">
                <ReportViewer
                  reportType={selectedReport}
                  reportDate={reportDate}
                  positionId={positionId}
                  candidateId={candidateId}
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
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 4px 8px; }
        }
      `}</style>
    </div>
  );
};

export default VoteReportsPage;
