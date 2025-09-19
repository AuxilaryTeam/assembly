import React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ---------- Types ---------- */
export interface PublicNominee {
  id: string;
  name: string;
  position?: string;
  description?: string;
  votes?: number;
}

export interface PublicProposal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  start?: string;
  end?: string;
  status?: string;
}

/* ---------- Props ---------- */
type Props = {
  proposalId?: string;
  autoRotate?: boolean;
  demo?: boolean;
  overtakeIntervalMs?: number;
  topCount?: number; // configurable top N
  sortKey?: "votes" | "name";
};

/* ---------- Helpers & Dummy Data (unchanged) ---------- */
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
  title: "Elect Board Members — FY25",
  description: "Public display of live, weighted votes by shareholders.",
  category: "Governance",
  start: new Date().toISOString(),
  end: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  status: "live",
};

const DUMMY_NOMINEES: PublicNominee[] = [
  { id: "n1", name: "Dr. Hana Solomon", position: "Chair", votes: 25000 },
  { id: "n2", name: "Mr. Fikru Alem", position: "Board Member", votes: 18000 },
  { id: "n3", name: "Ms. Liya Bekele", position: "Board Member", votes: 12000 },
  {
    id: "n4",
    name: "Mr. Solomon Desta",
    position: "Board Member",
    votes: 7000,
  },
  {
    id: "n5",
    name: "Ms. Selam Tadesse",
    position: "Board Member",
    votes: 4000,
  },
  {
    id: "a1",
    name: "Dr. Amina Tesfaye",
    position: "Board Member",
    votes: 2500,
  },
  { id: "a2", name: "Mr. Yonas Kebede", position: "Board Member", votes: 2000 },
  {
    id: "a3",
    name: "Ms. Eden Mulugeta",
    position: "Board Member",
    votes: 1500,
  },
  { id: "a4", name: "Mr. Dawit Gebre", position: "Board Member", votes: 1000 },
  { id: "a5", name: "Ms. Tsedey Asrat", position: "Board Member", votes: 800 },
  { id: "b1", name: "Dr. Kaleb Worku", position: "Board Member", votes: 600 },
  {
    id: "b2",
    name: "Mr. Bereket Tsegaye",
    position: "Board Member",
    votes: 400,
  },
  { id: "b3", name: "Ms. Ruth Haile", position: "Board Member", votes: 300 },
  { id: "b4", name: "Mr. Elias Negash", position: "Board Member", votes: 200 },
  { id: "b5", name: "Ms. Mahlet Abebe", position: "Board Member", votes: 100 },
];

/* ---------- Component ---------- */
export default function PublicPollDisplay({
  proposalId,
  autoRotate = false,
  demo = true,
  overtakeIntervalMs = 5000,
  topCount = 5,
  sortKey = "votes",
}: Props) {
  const [proposal, setProposal] = useState<PublicProposal | null>(
    demo ? DUMMY_PROPOSAL : null
  );
  const [nominees, setNominees] = useState<PublicNominee[]>(
    demo
      ? DUMMY_NOMINEES.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0))
      : []
  );
  const [highlightIndex, setHighlightIndex] = useState(0);

  // FLIP & movement refs
  const nodesRef = useRef<Record<string, HTMLElement | null>>({});
  const prevPositionsRef = useRef<Record<string, DOMRect>>({});
  const prevOrderRef = useRef<string[]>(nominees.map((n) => n.id));
  const movementRef = useRef<
    Record<
      string,
      { dir: "up" | "down"; timeout: ReturnType<typeof setTimeout> }
    >
  >({});

  // initial ordering once
  useEffect(() => {
    setNominees((prev) =>
      [...prev].sort((a, b) =>
        sortKey === "votes"
          ? (b.votes || 0) - (a.votes || 0)
          : a.name.localeCompare(b.name)
      )
    );
    prevOrderRef.current = nominees.map((n) => n.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FLIP measurement + play
  useLayoutEffect(() => {
    const positions: Record<string, DOMRect> = {};
    nominees.forEach((n) => {
      const el = nodesRef.current[n.id];
      if (el) positions[n.id] = el.getBoundingClientRect();
    });

    const prev = prevPositionsRef.current;
    if (Object.keys(prev).length) {
      nominees.forEach((n) => {
        const el = nodesRef.current[n.id];
        if (!el) return;
        const prevRect = prev[n.id];
        const newRect = positions[n.id];
        if (!prevRect || !newRect) return;
        const deltaY = prevRect.top - newRect.top;
        if (deltaY) {
          el.style.transition = "none";
          el.style.transform = `translateY(${deltaY}px)`;
          requestAnimationFrame(() => {
            el.style.transition = "transform 600ms cubic-bezier(.2,.9,.2,1)";
            el.style.transform = "";
          });
        }
      });
    }

    prevPositionsRef.current = positions;
    prevOrderRef.current = nominees.map((n) => n.id);
  }, [nominees]);

  /* ---------------- Demo simulation (same logic) ---------------- */
  useEffect(() => {
    if (!demo) return;

    const smallIv = setInterval(() => {
      setNominees((prev) => {
        if (prev.length === 0) return prev;
        const copy = prev.map((p) => ({ ...p }));
        const idx = Math.floor(Math.random() * copy.length);
        const leaderVotes = copy[0].votes || 0;
        const min = Math.max(1, Math.round(leaderVotes * 0.005));
        const max = Math.max(2, Math.round(leaderVotes * 0.02));
        const inc = Math.floor(Math.random() * (max - min + 1)) + min;
        copy[idx].votes = (copy[idx].votes || 0) + inc;

        const sorted = copy
          .slice()
          .sort((a, b) => (b.votes || 0) - (a.votes || 0));

        const oldOrder = prev.map((p) => p.id);
        const newOrder = sorted.map((p) => p.id);
        newOrder.forEach((id, newIdx) => {
          const oldIdx = oldOrder.indexOf(id);
          if (oldIdx === -1) return;
          if (newIdx < oldIdx) markMovement(id, "up");
          else if (newIdx > oldIdx) markMovement(id, "down");
        });

        return sorted;
      });
    }, 2000);

    const overtakeIv = setInterval(() => {
      setNominees((prev) => {
        if (prev.length <= 1) return prev;
        const copy = prev.map((p) => ({ ...p }));
        const candidatesIdx = copy.map((_, i) => i).filter((i) => i > 0);
        const pickIdx =
          candidatesIdx[Math.floor(Math.random() * candidatesIdx.length)];
        const targetIdx = Math.max(0, pickIdx - 1);
        const currentVotes = copy[pickIdx].votes || 0;
        const votesToBeat =
          (copy[targetIdx].votes || 0) -
          currentVotes +
          Math.ceil(Math.max(1, (copy[targetIdx].votes || 0) * 0.03));
        const inc = Math.max(1, votesToBeat);
        copy[pickIdx].votes = currentVotes + inc;

        const sorted = copy
          .slice()
          .sort((a, b) => (b.votes || 0) - (a.votes || 0));
        const oldOrder = prev.map((p) => p.id);
        const newOrder = sorted.map((p) => p.id);
        newOrder.forEach((id, newIdx) => {
          const oldIdx = oldOrder.indexOf(id);
          if (oldIdx === -1) return;
          if (newIdx < oldIdx) markMovement(id, "up");
          else if (newIdx > oldIdx) markMovement(id, "down");
        });

        return sorted;
      });
    }, overtakeIntervalMs);

    return () => {
      clearInterval(smallIv);
      clearInterval(overtakeIv);
      Object.values(movementRef.current).forEach((m) =>
        clearTimeout(m.timeout)
      );
      movementRef.current = {};
    };
  }, [demo, overtakeIntervalMs]);

  function markMovement(id: string, dir: "up" | "down") {
    if (movementRef.current[id]) clearTimeout(movementRef.current[id].timeout);
    const t = setTimeout(() => {
      delete movementRef.current[id];
      setNominees((cur) => [...cur]);
    }, 1400);
    movementRef.current[id] = { dir, timeout: t };
    setNominees((cur) => [...cur]);
  }

  useEffect(() => {
    if (!autoRotate) return;
    if (nominees.length <= 1) return;
    const iv = setInterval(
      () => setHighlightIndex((i) => (i + 1) % nominees.length),
      4200
    );
    return () => clearInterval(iv);
  }, [autoRotate, nominees.length]);

  /* ---------------- Sorting + split logic ---------------- */
  const sortedNominees = useMemo(() => {
    const copy = nominees.slice();
    return sortKey === "votes"
      ? copy.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      : copy.sort((a, b) => a.name.localeCompare(b.name));
  }, [nominees, sortKey]);

  const totalVotes = useMemo(
    () => sortedNominees.reduce((s, n) => s + (n.votes || 0), 0),
    [sortedNominees]
  );

  const safeTopCount = Math.max(
    0,
    Math.min(sortedNominees.length, Math.floor(topCount || 0))
  );

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-white text-black p-4 flex items-center justify-center">
      <style>{`
        .bar-inner { transition: width 700ms cubic-bezier(.2,.9,.2,1); }
        .row-move { transition: background-color 600ms ease, color 500ms ease; }
        .row-up { background-color: rgba(241,171,21,0.12) !important; }
        .row-down { background-color: rgba(220,38,38,0.08) !important; }
        .text-up { color: rgba(241,171,21,1) !important; }
        .text-down { color: rgba(220,38,38,1) !important; }
        .top-highlight { background-color: rgba(241,171,21,0.08); }
        .pct-bar { background-color: rgba(0,0,0,0.1); border-radius: 999px; height: 24px; overflow: hidden; }
        .pct-bar-inner { height: 100%; border-radius: 999px; background-color: #f1ab15; }
        .table-container { max-height: 80vh; overflow-y: auto; }
      `}</style>

      <div className="w-full max-w-full">
        {/* header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-[#f1ab15] flex items-center justify-center text-white text-2xl font-bold">
              S
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                {proposal?.title ?? "Live Poll"}
              </h1>
              <div className="text-base text-black text-opacity-70">
                {proposal?.category ?? "—"} • {proposal?.status ?? "—"}
              </div>
            </div>
          </div>
        </header>

        <main>
          <section className="bg-white border border-black/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Nominees</h2>
              <div className="text-2xl text-black text-opacity-70">
                Total votes: <strong>{totalVotes.toLocaleString()}</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-base text-black text-opacity-70">
                    <th className="p-4 w-10">#</th>
                    <th className="p-4">Nominee</th>
                    <th className="p-4 w-80">Percentage</th>
                    <th className="p-4 text-right w-36">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNominees.map((n, i) => {
                    const rank = i + 1;
                    const pct =
                      totalVotes === 0
                        ? 0
                        : Math.round(((n.votes || 0) / totalVotes) * 100);
                    const movement = movementRef.current[n.id]?.dir;

                    // Insert a single-line separator after the topCount nominee
                    const separator =
                      i === safeTopCount &&
                      safeTopCount < sortedNominees.length ? (
                        <tr key={`separator-${i}`}>
                          <td colSpan={4} className="p-0">
                            <div className="border-t-6 border-[#f1ab15]"></div>
                          </td>
                        </tr>
                      ) : null;

                    return (
                      <React.Fragment key={n.id}>
                        {separator}
                        <tr
                          className={`row-move ${
                            i % 2 === 0 ? "bg-white" : "bg-[#f1ab15]/5"
                          }`}
                          ref={(el) => {
                            nodesRef.current[n.id] = el as HTMLElement;
                          }}>
                          <td
                            className={`p-4 text-2xl font-black ${
                              rank <= safeTopCount ? "text-[#f1ab15]" : ""
                            }`}>
                            {rank}
                          </td>
                          <td
                            className={`p-4 ${
                              movement === "up"
                                ? "row-up"
                                : movement === "down"
                                ? "row-down"
                                : ""
                            }`}>
                            <div className="font-bold text-2xl">{n.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-6">
                              <div className="flex-1">
                                <div
                                  className="pct-bar"
                                  role="progressbar"
                                  aria-valuenow={pct}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                  aria-label={`${n.name} percentage`}>
                                  <div
                                    className="pct-bar-inner bar-inner"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-2xl font-semibold text-black w-16 text-right">
                                {pct}%
                              </div>
                            </div>
                          </td>
                          <td
                            className={`p-4 text-right font-mono font-bold text-2xl ${
                              movement === "up"
                                ? "text-up"
                                : movement === "down"
                                ? "text-down"
                                : ""
                            }`}>
                            {(n.votes || 0).toLocaleString()}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
