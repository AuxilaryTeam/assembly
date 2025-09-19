import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

type Option = { id: number; label: string };
type Issue = {
  id: number;
  title: string;
  description?: string;
  options: Option[];
};

export default function VoteForm() {
  const { id } = useParams();
  const [issue, setIssue] = useState<Issue>({
    id: 0,
    title: "Dummy Issue Title",
    description: "This is a placeholder issue description.",
    options: [
      { id: 1, label: "Dummy Option A" },
      { id: 2, label: "Dummy Option B" },
    ],
  });
  const [selected, setSelected] = useState<number | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/issue/getIssue/${id}`);

        if (res.data && res.data.options) {
          setIssue(res.data);
        } else {
          console.error("Unexpected API response:", res.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const submit = async () => {
    if (!selected) return alert("Select an option");
    try {
      await axios.post("/api/issue/vote", {
        issueId: Number(id),
        optionId: selected,
      });
      alert("Vote recorded");
      nav("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Vote failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{issue.title}</h2>
      <p className="mb-4 text-gray-700">{issue.description}</p>

      <div className="space-y-2">
        {issue.options.map((o) => (
          <label
            key={o.id}
            className="flex items-center gap-3 p-2 border rounded">
            <input
              type="radio"
              name="vote"
              checked={selected === o.id}
              onChange={() => setSelected(o.id)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={submit}
          className="px-4 py-2 rounded bg-blue-600 text-white">
          Submit Vote
        </button>
      </div>
    </div>
  );
}
