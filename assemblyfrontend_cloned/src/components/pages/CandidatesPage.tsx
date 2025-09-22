import React, { useEffect, useState, useMemo } from "react";
import {
  registerCandidate,
  getAllCandidates,
  updateCandidateById,
  assignCandidate,
} from "../utils/api"; // adjust path to where your API functions live
import CopyButton from "../CopyButton";
import { Pencil } from "lucide-react";

// Minimal types — adapt to your real backend DTOs
type Candidate = {
  id?: number;
  fullName?: string;
  manifesto?: string;
  photoUrl?: string | null;
  active?: boolean;
  // add other fields your backend returns
};

type Props = {
  // If you already have the list in the parent, pass it here to avoid refetching
  initialCandidates?: Candidate[];
};

export default function CandidatesPage({
  initialCandidates,
}: Props): JSX.Element {
  const [candidates, setCandidates] = useState<Candidate[]>(
    initialCandidates ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // register form state
  const [newCandidate, setNewCandidate] = useState({
    fullName: "",
    manifesto: "",
  });

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCandidate, setEditingCandidate] = useState({
    fullName: "",
    manifesto: "",
  });

  // assign state
  const [assignPayload, setAssignPayload] = useState({
    candidateId: "",
    positionId: "",
  });

  // search state
  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    // If parent passed candidates, skip fetching
    if (initialCandidates && initialCandidates.length > 0) return;
    fetchCandidates();
  }, [initialCandidates]);

  async function fetchCandidates() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCandidates();
      // axios returns { data }
      setCandidates(res.data ?? []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not load candidates"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await registerCandidate(newCandidate);
      // append the created candidate
      setCandidates((prev) => [res.data, ...prev]);
      setNewCandidate({ fullName: "", manifesto: "" });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    }
  }

  function startEdit(c: Candidate) {
    setEditingId(c.id ?? null);
    setEditingCandidate({
      fullName: c.fullName ?? "",
      manifesto: c.manifesto ?? "",
    });
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId == null) return;
    setError(null);
    try {
      const res = await updateCandidateById(editingId, editingCandidate);
      // replace in list
      setCandidates((prev) =>
        prev.map((p) => (p.id === editingId ? res.data : p))
      );
      setEditingId(null);
      setEditingCandidate({ fullName: "", manifesto: "" });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Update failed");
    }
  }

  async function submitAssign(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        candidateId: Number(assignPayload.candidateId),
        positionId: Number(assignPayload.positionId),
      };
      const res = await assignCandidate(payload);
      // optionally update local state or refetch
      await fetchCandidates();
      setAssignPayload({ candidateId: "", positionId: "" });
      alert("Assigned: " + JSON.stringify(res.data));
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Assignment failed"
      );
    }
  }

  // SEARCH: memoized filtered list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates.filter((c) => {
      if (!c) return false;
      if (onlyActive && !c.active) return false;
      if (!q) return true;
      // match by id, fullName, manifesto
      const idMatch = c.id !== undefined && String(c.id).includes(q);
      const nameMatch = (c.fullName ?? "").toLowerCase().includes(q);
      const manifestoMatch = (c.manifesto ?? "").toLowerCase().includes(q);
      return idMatch || nameMatch || manifestoMatch;
    });
  }, [candidates, query, onlyActive]);

  return (
    <div className=" max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Candidates</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded">
          {error}
        </div>
      )}

      <section className="grid md:grid-cols-2 gap-6">
        <form
          onSubmit={handleRegister}
          className="p-4 border rounded space-y-3">
          <h2 className="font-medium">Register candidate</h2>
          <label className="block">
            <div className="text-sm">Full name</div>
            <input
              value={newCandidate.fullName}
              onChange={(e) =>
                setNewCandidate((s) => ({ ...s, fullName: e.target.value }))
              }
              className="mt-1 w-full border rounded p-2"
              required
            />
          </label>
          <label className="block">
            <div className="text-sm">Manifesto</div>
            <textarea
              value={newCandidate.manifesto}
              onChange={(e) =>
                setNewCandidate((s) => ({ ...s, manifesto: e.target.value }))
              }
              className="mt-1 w-full border rounded p-2"
            />
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Register
            </button>
            <button
              type="button"
              onClick={() => setNewCandidate({ fullName: "", manifesto: "" })}
              className="px-4 py-2 border rounded">
              Reset
            </button>
          </div>
        </form>

        <form onSubmit={submitAssign} className="p-4 border rounded space-y-3">
          <h2 className="font-medium">Assign candidate to position</h2>
          <label className="block">
            <div className="text-sm">Candidate ID</div>
            <input
              value={assignPayload.candidateId}
              onChange={(e) =>
                setAssignPayload((s) => ({ ...s, candidateId: e.target.value }))
              }
              className="mt-1 w-full border rounded p-2"
              required
            />
          </label>
          <label className="block">
            <div className="text-sm">Position ID</div>
            <input
              value={assignPayload.positionId}
              onChange={(e) =>
                setAssignPayload((s) => ({ ...s, positionId: e.target.value }))
              }
              className="mt-1 w-full border rounded p-2"
              required
            />
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Assign
            </button>
            <button
              type="button"
              onClick={() =>
                setAssignPayload({ candidateId: "", positionId: "" })
              }
              className="px-4 py-2 border rounded">
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="p-4 border rounded">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <input
              placeholder="Search by name, manifesto or id..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border rounded p-2 w-72"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(e) => setOnlyActive(e.target.checked)}
              />
              Only active
            </label>
          </div>

          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${filtered.length} items`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Photo</th>
                <th className="p-2">Full name</th>
                <th className="p-2">Manifesto</th>
                <th className="p-2">Active</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t align-top">
                  <td className="p-2 align-middle">{c.id}</td>
                  <td className="p-2">
                    {c.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.photoUrl}
                        // alt={c.fullName}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-sm">
                        No photo
                      </div>
                    )}
                  </td>
                  <td className="p-2">{c.fullName}</td>
                  <td className="p-2">{c.manifesto}</td>
                  <td className="p-2">{c.active ? "Yes" : "No"}</td>
                  <td className="p-2 space-x-2 flex">
                    <button
                      onClick={() => startEdit(c)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm 
             border 
              transition">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <td className="border px-4 py-2">
                      <CopyButton text={String(c.id)} />
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editingId != null && (
        <section className="p-4 border rounded">
          <h2 className="font-medium mb-2">Edit candidate #{editingId}</h2>
          <form onSubmit={submitEdit} className="space-y-3">
            <label className="block">
              <div className="text-sm">Full name</div>
              <input
                value={editingCandidate.fullName}
                onChange={(e) =>
                  setEditingCandidate((s) => ({
                    ...s,
                    fullName: e.target.value,
                  }))
                }
                className="mt-1 w-full border rounded p-2"
                required
              />
            </label>
            <label className="block">
              <div className="text-sm">Manifesto</div>
              <textarea
                value={editingCandidate.manifesto}
                onChange={(e) =>
                  setEditingCandidate((s) => ({
                    ...s,
                    manifesto: e.target.value,
                  }))
                }
                className="mt-1 w-full border rounded p-2"
              />
            </label>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-yellow-600 text-white rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 border rounded">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
