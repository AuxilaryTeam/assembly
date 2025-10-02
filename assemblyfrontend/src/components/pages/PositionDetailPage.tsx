import { useNavigate, useParams } from "react-router-dom";
import {
  getPositionInfo,
  getVoterById,
  voteIssue,
  votePosition,
} from "../utils/api";
import type { IssueResult, VoteRequest, VoterItem } from "../utils/types";
import { useEffect, useState } from "react";
import { FaSearch, FaClipboardCheck } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { CircleX, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface Candidate {
  id: number;
  fullName: string;
  manifesto: string;
  photoUrl: string;
  active: boolean;
}

interface PositionData {
  maxVotes: number;
  candidates: Candidate[];
  title: string;
  description: string;
  status: string;
}

/**
 * Helper: try to read a value from a response object using many possible keys
 */
const pick = (obj: any, ...keys: string[]) => {
  if (!obj) return undefined;
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
    // try case-insensitive match
    const foundKey = Object.keys(obj).find(
      (kk) => kk.toLowerCase() === k.toLowerCase()
    );
    if (foundKey) return obj[foundKey];
  }
  return undefined;
};

/**
 * Normalize API response to IssueResult shape
 */
const normalizeToIssueResult = (raw: any): IssueResult => {
  const title =
    pick(raw, "title", "Issue Title", "IssueTitle", "issue_title") ||
    (typeof raw === "string" ? raw : "") ||
    "";
  const description =
    pick(
      raw,
      "description",
      "Issue Description",
      "IssueDescription",
      "issue_description"
    ) || "";
  const status =
    (pick(raw, "status", "Status", "issueStatus") || "").toString() || "";
  const active = Boolean(
    pick(raw, "active", "isActive", "active_flag") || false
  );

  // options may be under several keys: options, option with results, option_with_results, results
  let rawOptions =
    pick(
      raw,
      "options",
      "option with results",
      "option_with_results",
      "results"
    ) ||
    pick(raw, "optionWithResults") ||
    null;

  // If options not found, the API might have them nested inside a different field
  if (!rawOptions) {
    const candidate = Object.values(raw).find(
      (v) =>
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        Object.values(v).every((val) => typeof val === "number")
    );
    rawOptions = candidate || null;
  }

  const optionsObj: Record<string, number> =
    rawOptions && typeof rawOptions === "object"
      ? Object.entries(rawOptions).reduce((acc, [k, v]) => {
          const num = typeof v === "number" ? v : Number(v);
          acc[k.toUpperCase()] = Number.isFinite(num) ? num : 0;
          return acc;
        }, {} as Record<string, number>)
      : {};

  return {
    title,
    description,
    status: status.toString(),
    options: optionsObj,
  };
};

const DetailItem = ({
  label,
  value,
  valueClass = "text-gray-800",
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

const PositionDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [issueData, setIssueData] = useState<IssueResult>({
    title: "",
    description: "",
    status: "",
    options: {},
  });
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [search, setSearch] = useState("");
  const [voterData, setVoterData] = useState<VoterItem | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await getVoterById(search);
      console.log("Search Shareholder with id ", search, response.data);
      setVoterData(response.data);
    } catch (err: any) {
      console.error("Error Searching with value,", search, ":", err);
      setVoterData(null);

      const msg =
        err?.response?.data?.message ?? err?.message ?? "Unknown error";
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error fetching shareholder</span>
          </div>
        ),
        description: msg,
        duration: 4000,
      });
    }
  };

  const handleCandidateToggle = (candidateId: number) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(
        selectedCandidates.filter((id) => id !== candidateId)
      );
    } else if (selectedCandidates.length < (positionData?.maxVotes || 1)) {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    } else {
      toast({
        variant: "default",
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Selection Limit</span>
          </div>
        ),
        description: `You can only select up to ${positionData?.maxVotes} candidate(s).`,
        duration: 4000,
      });
    }
  };

  const handleVoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!voterData?.attendance) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Cannot Submit Vote</span>
          </div>
        ),
        description: "Shareholder is not present.",
        duration: 4000,
      });
      return;
    }

    if (selectedCandidates.length === 0) {
      toast({
        variant: "default",
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>No Candidates Selected</span>
          </div>
        ),
        description: "Please select at least one candidate before submitting.",
        duration: 4000,
      });
      return;
    }

    if (
      positionData?.maxVotes &&
      selectedCandidates.length > positionData.maxVotes
    ) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Too Many Selections</span>
          </div>
        ),
        description: `You have selected ${selectedCandidates.length} candidates, but the maximum allowed is ${positionData.maxVotes}. Please adjust your selection.`,
        duration: 4000,
      });
      return;
    }

    try {
      const votePromises = selectedCandidates.map((candidateId) => {
        const voteDTO: VoteRequest = {
          positionId: Number(id),
          candidateId,
          voterId: voterData!.id,
          voterShareHolderId: voterData!.shareholderid ?? "",
        };
        return votePosition(voteDTO);
      });

      const responses = await Promise.all(votePromises);
      console.log("Vote responses:", responses);

      toast({
        variant: "default",
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Vote Submitted</span>
          </div>
        ),
        description: `Vote(s) for ${selectedCandidates.length} candidate(s) submitted successfully!`,
        duration: 4000,
      });

      setSelectedCandidates([]); // Reset selections after submission
    } catch (err: any) {
      console.error("Error submitting vote:", err);
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Unknown error";
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error Submitting Vote</span>
          </div>
        ),
        description: msg,
        duration: 4000,
      });
    }
  };

  const fetchData = async (positionId: number) => {
    if (positionId <= 0) return;
    try {
      const response = await getPositionInfo(positionId);
      const raw = response.data;
      console.log("Position Data: ", raw);

      const normalized = normalizeToIssueResult(raw);
      setIssueData(normalized);
      setPositionData(raw as PositionData); // Store raw data for candidates and maxVotes
    } catch (err: any) {
      console.error("Error fetching Issue Data:", err);
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Unknown error";
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error Fetching Issue</span>
          </div>
        ),
        description: msg,
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(Number(id));
    }
  }, [id]);

  const statusClass = (s: string) => {
    const lower = (s || "").toLowerCase();
    if (lower === "open") return "bg-green-500";
    if (lower === "closed") return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="p-5 flex flex-col gap-4 max-w-7xl mx-auto">
      <Button
        variant="outline"
        onClick={() => navigate("/positions")}
        className="flex items-center gap-2">
        <ArrowLeft size={18} />
        Back
      </Button>
      {/* Top Section: Issue Details with Search Bar */}
      <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 transition-transform hover:scale-[1.01] duration-300">
        <div className="flex items-center gap-3 mb-6">
          <FaClipboardCheck className="text-4xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800 font-sans">
            {issueData.title || "Position Details"}
          </h1>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Description:</span>{" "}
            {issueData.description || "—"}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusClass(
                issueData.status
              )}`}>
              {issueData.status || "UNKNOWN"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-800">Max Votes:</span>{" "}
            {positionData?.maxVotes || "—"}
          </p>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative flex max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <FaSearch className="text-[#f1ab15] text-lg" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Shareholder ID..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#f1ab15] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#f1ab15] transition-shadow hover:shadow-md text-gray-700"
              />
              <button
                type="submit"
                className="bg-[#f1ab15] hover:bg-yellow-600 text-white px-6 py-3 rounded-r-lg transition-colors font-medium cursor-pointer">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section: Voter Details and Vote Form */}
      {voterData && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Voter Details */}
          <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-8 border border-gray-100 transition-transform hover:scale-[1.01] duration-300">
            <h3 className="font-bold text-2xl mb-6 text-gray-800 font-sans">
              Shareholder Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem label="ID" value={voterData.shareholderid ?? ""} />
              <DetailItem label="Name (Eng)" value={voterData.nameeng ?? ""} />
              <DetailItem label="Name (Amh)" value={voterData.nameamh ?? ""} />
              <DetailItem label="Phone" value={voterData.phone ?? ""} />
              <DetailItem
                label="Attendance"
                value={voterData.attendance ? "Present" : "Absent"}
                valueClass={
                  voterData.attendance ? "text-green-600" : "text-red-600"
                }
              />
              <DetailItem
                label="Voting Subscription"
                value={voterData.votingsubscription ?? ""}
              />
            </div>
          </div>

          {/* Right: Vote Form */}
          <div className="md:w-1/2 bg-white shadow-lg rounded-xl p-8 border border-gray-100 transition-transform hover:scale-[1.01] duration-300">
            <h3 className="font-bold text-2xl mb-6 text-gray-800 font-sans">
              Cast Shareholder Vote
            </h3>
            <form onSubmit={handleVoteSubmit} className="flex flex-col gap-y-4">
              {positionData?.candidates
                ?.filter((candidate) => candidate.active)
                .map((candidate) => (
                  <label
                    key={candidate.id}
                    className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleCandidateToggle(candidate.id)}
                      className="accent-blue-600 h-5 w-5"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">
                        {candidate.fullName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {candidate.manifesto}
                      </span>
                    </div>
                  </label>
                ))}
              <button
                disabled={
                  !voterData.attendance || selectedCandidates.length === 0
                }
                type="submit"
                className={`mt-4 px-6 py-3 rounded-lg transition-colors font-medium text-white
                  ${
                    voterData.attendance && selectedCandidates.length > 0
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}>
                Submit Vote{selectedCandidates.length > 1 ? "s" : ""}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionDetailPage;
