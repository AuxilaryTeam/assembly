import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

type Issue = { id: number; title: string; description?: string };

export default function ActiveIssuesList() {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: "Dummy Issue #1",
      description: "This is a placeholder issue.",
    },
    {
      id: 2,
      title: "Dummy Issue #2",
      description: "Will be replaced by API data.",
    },
  ]);
  const nav = useNavigate();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axios.get("/api/issue/active");
  //       setIssues(res.data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();
  // }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Active Issues</h2>
      <div className="grid gap-3">
        {issues.map((i) => (
          <div
            key={i.id}
            className="p-3 rounded border flex justify-between items-center">
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-gray-600">{i.description}</div>
            </div>
            <div>
              <button
                onClick={() => nav(`/vote/${i.id}`)}
                className="px-3 py-1 rounded bg-green-600 text-white">
                Vote
              </button>
            </div>
          </div>
        ))}
        {issues.length === 0 && (
          <div className="text-gray-500">No active issues</div>
        )}
      </div>
    </div>
  );
}
