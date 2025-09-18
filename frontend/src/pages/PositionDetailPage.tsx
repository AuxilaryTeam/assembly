import { useParams } from "react-router-dom";
import { getIssue, getVoterById, voteIssue } from "../components/utils/api";
import type {
  IssueResult,
  VoteRequest,
  VoterItem,
} from "../components/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaClipboardCheck } from "react-icons/fa";

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
    // attempt to find any object value that looks like vote counts (has numeric values)
    const candidate = Object.values(raw).find(
      (v) =>
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        Object.values(v).every((val) => typeof val === "number")
    );
    rawOptions = candidate || null;
  }

  // If still not found, fallback to empty object
  const optionsObj: Record<string, number> =
    rawOptions && typeof rawOptions === "object"
      ? Object.entries(rawOptions).reduce((acc, [k, v]) => {
          // convert numeric-like strings to numbers when needed
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

const ISSUE_OPTION_IDS = {
  YES: 0,
  NO: 1,
  ABSTAIN: 2,
};

const PositionDetailPage = () => {
  const { id } = useParams();
  const [issueData, setIssueData] = useState<IssueResult>({
    title: "",
    description: "",
    status: "",
    options: { YES: 0, NO: 0, ABSTAIN: 0 },
  });
  const [search, setSearch] = useState("");
  const [voterData, setVoterData] = useState<VoterItem | null>(null);
  const [selectedVote, setSelectedVote] = useState<
    "YES" | "NO" | "ABSTAIN" | ""
  >("");

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await getVoterById(search);
      console.log("Search Shareholder with id ", search, response.data);
      setVoterData(response.data);
    } catch (error) {
      console.error("Error Searching with value,", search, ":", error);
      setVoterData(null);
      toast.error("Error fetching shareholder data");
    }
  };

  // Function to submit the vote
  // Function to submit the vote
  const handleVoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVote) {
      toast.warning("Please select a vote before submitting.");
      return;
    }
    if (!voterData?.attendance) {
      toast.error("Cannot submit vote: Shareholder is not present.");
      return;
    }
    const voteDTO: VoteRequest = {
      issueId: Number(id),
      optionId: ISSUE_OPTION_IDS[selectedVote],
      voterId: voterData.id,
      voterShareHolderId: voterData.shareholderid ?? "",
    };
    console.log("Submitting vote:", voteDTO, "for", voterData.shareholderid);
    try {
      const response = await voteIssue(voteDTO);
      console.log(
        "Submitting vote:",
        selectedVote,
        "for",
        voterData.shareholderid
      );
      console.log("Response for Voting", response);
      toast.success(`Vote '${selectedVote}' submitted successfully!`);
      setSelectedVote(""); // Reset vote after submission
    } catch (error: any) {
      console.error("Error submitting vote:", error); // simple, safe fallback
      toast.error(
        `Error submitting vote: ${
          error?.response?.data?.message ?? error?.message ?? "Unknown error"
        }`
      );
    }
  };

  const fetchData = async (issueId: number) => {
    if (issueId <= 0) return;
    try {
      const response = await getIssue(issueId);
      const raw = response.data;
      console.log("Issue Data: ", raw);

      const normalized = normalizeToIssueResult(raw);
      setIssueData(normalized);
    } catch (error) {
      console.error("Error fetching Issue Data:", error);
      toast.error("Error fetching Issue Data");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(Number(id));
    }
  }, [id]);

  // helper: badge class for status
  const statusClass = (s: string) => {
    const lower = (s || "").toLowerCase();
    if (lower === "open") return "bg-green-500";
    if (lower === "closed") return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="p-5 flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Top Section: Issue Details with Search Bar */}
      <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 transition-transform hover:scale-[1.01] duration-300">
        <div className="flex items-center gap-3 mb-6">
          <FaClipboardCheck className="text-4xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800 font-sans">
            {issueData.title || "Issue Details"}
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
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="vote"
                  value="YES"
                  checked={selectedVote === "YES"}
                  onChange={() => setSelectedVote("YES")}
                  className="accent-blue-600 h-5 w-5"
                />
                <span className="text-gray-700 font-medium">YES</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="vote"
                  value="NO"
                  checked={selectedVote === "NO"}
                  onChange={() => setSelectedVote("NO")}
                  className="accent-red-600 h-5 w-5"
                />
                <span className="text-gray-700 font-medium">NO</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="vote"
                  value="ABSTAINs"
                  checked={selectedVote === "ABSTAIN"}
                  onChange={() => setSelectedVote("ABSTAIN")}
                  className="accent-yellow-600 h-5 w-5"
                />
                <span className="text-gray-700 font-medium">ABSTAIN</span>
              </label>
              <button
                disabled={!voterData.attendance}
                type="submit"
                className={`mt-4 px-6 py-3 rounded-lg transition-colors font-medium text-white
    ${
      voterData.attendance
        ? "bg-green-600 hover:bg-green-700 cursor-pointer"
        : "bg-gray-400 cursor-not-allowed"
    }`}>
                Submit Vote
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionDetailPage;
