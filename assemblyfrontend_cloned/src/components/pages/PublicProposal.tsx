import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface PublicProposal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  start?: string;
  end?: string;
  status?: string;
}

type Props = {
  proposalId?: string;
  demo?: boolean;
  overtakeIntervalMs?: number;
};

function formatTimeLeft(end?: string) {
  if (!end) return "Not scheduled";
  const diff = Date.parse(end) - Date.now();
  if (diff <= 0) return "Ended";
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hrs}h ${mins}m`;
}

const DUMMY_PROPOSAL: PublicProposal = {
  id: "demo-prop",
  title: "Shareholder Resolution — FY25",
  description: "Public display of live votes for the resolution.",
  category: "Governance",
  start: new Date().toISOString(),
  end: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  status: "live",
};

const INITIAL_VOTES = {
  Yes: 25000,
  No: 18000,
  Abstain: 12000,
};

export default function PublicPollDisplay({
  proposalId,
  demo = true,
  overtakeIntervalMs = 5000,
}: Props) {
  const [proposal, setProposal] = useState<PublicProposal | null>(
    demo ? DUMMY_PROPOSAL : null
  );
  const [votes, setVotes] = useState(INITIAL_VOTES);
  const navigate = useNavigate();

  useEffect(() => {
    if (!demo) return;

    const smallIv = setInterval(() => {
      setVotes((prev) => {
        const keys = Object.keys(prev) as (keyof typeof prev)[];
        const idx = Math.floor(Math.random() * keys.length);
        const key = keys[idx];
        const leaderVotes = Math.max(...Object.values(prev));
        const min = Math.max(1, Math.round(leaderVotes * 0.005));
        const max = Math.max(2, Math.round(leaderVotes * 0.02));
        const inc = Math.floor(Math.random() * (max - min + 1)) + min;
        return { ...prev, [key]: prev[key] + inc };
      });
    }, 2000);

    const overtakeIv = setInterval(() => {
      setVotes((prev) => {
        const keys = Object.keys(prev) as (keyof typeof prev)[];
        const candidatesIdx = keys
          .map((_, i) => i)
          .filter((i) => prev[keys[i]] !== Math.max(...Object.values(prev)));
        if (candidatesIdx.length === 0) return prev;
        const pickIdx =
          candidatesIdx[Math.floor(Math.random() * candidatesIdx.length)];
        const key = keys[pickIdx];
        const maxVotes = Math.max(...Object.values(prev));
        const inc = Math.max(
          1,
          maxVotes - prev[key] + Math.ceil(maxVotes * 0.03)
        );
        return { ...prev, [key]: prev[key] + inc };
      });
    }, overtakeIntervalMs);

    return () => {
      clearInterval(smallIv);
      clearInterval(overtakeIv);
    };
  }, [demo, overtakeIntervalMs]);

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const chartData = [
    {
      category: "Yes",
      votes: votes.Yes,
      percentage:
        totalVotes === 0 ? 0 : Math.round((votes.Yes / totalVotes) * 100),
      fill: "#f1ab15",
    },
    {
      category: "No",
      votes: votes.No,
      percentage:
        totalVotes === 0 ? 0 : Math.round((votes.No / totalVotes) * 100),
      fill: "#dc2626",
    },
    {
      category: "Abstain",
      votes: votes.Abstain,
      percentage:
        totalVotes === 0 ? 0 : Math.round((votes.Abstain / totalVotes) * 100),
      fill: "#6b7280",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.category}</p>
          <p className="text-sm text-gray-600">
            {data.votes.toLocaleString()} votes
          </p>
          <p className="text-sm font-medium text-gray-900">
            {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-start justify-center p-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
        {/* Header */}
        <Button
          variant="outline"
          onClick={() => navigate("/report")}
          className="flex items-center gap-2 mb-2">
          <ArrowLeft size={18} />
          Back
        </Button>
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f1ab15] flex items-center justify-center text-white text-xl font-bold">
              {proposal?.title[0] ?? "L"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {proposal?.title ?? "Live Poll"}
              </h1>
              <div className="text-sm text-black text-opacity-70">
                {proposal?.category ?? "—"} • {proposal?.status ?? "—"} •{" "}
                {formatTimeLeft(proposal?.end)}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          <section className="bg-white border border-black/10 rounded-lg p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Vote Distribution</h2>
              <div className="text-xl text-black text-opacity-70">
                Total votes: <strong>{totalVotes.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 14, fontWeight: 600, fill: "#374151" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => value.toLocaleString()}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="votes"
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: "top",
                      fill: "#374151",
                      fontSize: 30,
                      formatter: (value: number) => value.toLocaleString(),
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Percentage breakdown below chart */}
            <div className="mt-4 grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
              {chartData.map((item) => (
                <div key={item.category} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.percentage}%
                  </div>
                  <div className="text-xs font-medium text-gray-600 capitalize">
                    {item.category}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.votes.toLocaleString()} votes
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
