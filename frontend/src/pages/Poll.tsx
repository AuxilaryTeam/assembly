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
  { id: "n1", name: "Dr. Hana Solomon", position: "Chair", votes: 12000 },
  { id: "n2", name: "Mr. Fikru Alem", position: "Board Member", votes: 9800 },
  { id: "n3", name: "Ms. Liya Bekele", position: "Board Member", votes: 5600 },
  {
    id: "n4",
    name: "Mr. Solomon Desta",
    position: "Board Member",
    votes: 3200,
  },
  {
    id: "n5",
    name: "Ms. Selam Tadesse",
    position: "Board Member",
    votes: 2100,
  },
  { id: "a1", name: "Dr. Hana Solomon", position: "Chair", votes: 12000 },
  { id: "a2", name: "Mr. Fikru Alem", position: "Board Member", votes: 9800 },
  { id: "a3", name: "Ms. Liya Bekele", position: "Board Member", votes: 5600 },
  {
    id: "a4",
    name: "Mr. Solomon Desta",
    position: "Board Member",
    votes: 3200,
  },
  {
    id: "a5",
    name: "Ms. Selam Tadesse",
    position: "Board Member",
    votes: 2100,
  },
  { id: "b1", name: "Dr. Hana Solomon", position: "Chair", votes: 12000 },
  { id: "b2", name: "Mr. Fikru Alem", position: "Board Member", votes: 9800 },
  { id: "b3", name: "Ms. Liya Bekele", position: "Board Member", votes: 5600 },
  {
    id: "b4",
    name: "Mr. Solomon Desta",
    position: "Board Member",
    votes: 3200,
  },
  {
    id: "b5",
    name: "Ms. Selam Tadesse",
    position: "Board Member",
    votes: 2100,
  },
];

/* ---------- Component ---------- */
export default function PublicPollDisplay({
  proposalId,
  autoRotate = false,
  demo = true,
  overtakeIntervalMs = 5000,
  topCount = 10,
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
  const topList = sortedNominees.slice(0, safeTopCount);
  const others = sortedNominees.slice(safeTopCount);

  // NEW: show split layout only when topCount is meaningfully larger than the leaderboard (user's rule)
  const showSplit = safeTopCount > 3;

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center">
      <style>{`
        .bar-inner { transition: width 700ms cubic-bezier(.2,.9,.2,1); }
        .row-move { transition: background-color 600ms ease, color 500ms ease; }
        .row-up { background-color: rgba(241,171,21,0.12) !important; }
        .row-down { background-color: rgba(220,38,38,0.08) !important; }
        .text-up { color: rgba(241,171,21,1) !important; }
        .text-down { color: rgba(220,38,38,1) !important; }
        .top-highlight { background-color: rgba(241,171,21,0.08); }
        .pct-bar { background-color: rgba(0,0,0,0.04); border-radius: 999px; height: 14px; overflow: hidden; }
        .pct-bar-inner { height: 100%; border-radius: 999px; background-color: #f1ab15; }
      `}</style>

      <div className="w-full max-w-6xl">
        {/* header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#f1ab15] flex items-center justify-center text-white text-xl font-bold">
              S
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {proposal?.title ?? "Live Poll"}
              </h1>
              <div className="text-sm text-black text-opacity-70">
                {proposal?.category ?? "—"} • {proposal?.status ?? "—"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-black text-opacity-70">Ends in</div>
            <div className="mt-1 px-3 py-1 rounded bg-[#f1ab15]/10 font-mono">
              {formatTimeLeft(proposal?.end)}
            </div>
          </div>
        </header>

        <main>
          {/* Top-3 leaderboard (kept) */}
          {!showSplit && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {sortedNominees.slice(0, 3).map((n, idx) => {
                const pct =
                  totalVotes === 0
                    ? 0
                    : Math.round(((n.votes || 0) / totalVotes) * 100);
                const movement = movementRef.current[n.id]?.dir;
                const isHighlight = idx === highlightIndex;
                return (
                  <div
                    key={n.id}
                    className={`p-6 rounded-lg shadow-sm border border-black/5 ${
                      movement
                        ? movement === "up"
                          ? "row-up"
                          : "row-down"
                        : ""
                    } ${movement ? "overtake" : ""} ${
                      isHighlight ? "ring-4 ring-[#f1ab15]/30" : ""
                    }`}
                    ref={(el) => {
                      nodesRef.current[n.id] = el;
                    }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-black text-opacity-70">
                          {idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd"}
                        </div>
                        <div className="text-xl font-semibold mt-1">
                          {n.name}
                        </div>
                        <div className="text-xs text-black text-opacity-70 mt-1">
                          {n.position}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${
                            movement === "up"
                              ? "text-up"
                              : movement === "down"
                              ? "text-down"
                              : ""
                          }`}>
                          {(n.votes || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-black text-opacity-70">
                          {pct}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 h-3 bg-[#f1ab15]/10 rounded overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-3 bar-inner bg-[#f1ab15]"
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* CONDITIONAL AREA:
              - if showSplit === true: render TopN (larger) + Others
              - else: render single full-width table with all nominees
          */}
          {showSplit ? (
            /* SPLIT LAYOUT (TopN + Others) - same as previous behavior */
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-black/10 rounded p-4 md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Top {safeTopCount}</h2>
                  <div className="text-sm text-black text-opacity-70">
                    Total votes: <strong>{totalVotes.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-xs text-black text-opacity-70">
                        <th className="p-3 w-12">#</th>
                        <th className="p-3">Nominee</th>
                        <th className="p-3 w-48">Percentage</th>
                        <th className="p-3 text-right w-36">Votes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topList.map((n, i) => {
                        const rank = i + 1;
                        const pct =
                          totalVotes === 0
                            ? 0
                            : Math.round(((n.votes || 0) / totalVotes) * 100);
                        const movement = movementRef.current[n.id]?.dir;
                        return (
                          <tr
                            key={n.id}
                            className={`row-move top-highlight`}
                            ref={(el) => {
                              nodesRef.current[n.id] = el as HTMLElement;
                            }}>
                            <td className="p-3 font-medium">{rank}</td>
                            <td
                              className={`p-3 ${
                                movement === "up"
                                  ? "row-up"
                                  : movement === "down"
                                  ? "row-down"
                                  : ""
                              }`}>
                              <div className="font-semibold">{n.name}</div>
                              <div className="text-xs text-black text-opacity-60">
                                {n.position}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
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
                                <div className="text-sm text-black text-opacity-70 w-12 text-right">
                                  {pct}%
                                </div>
                              </div>
                            </td>
                            <td
                              className={`p-3 text-right font-mono ${
                                movement === "up" ? "top-text" : ""
                              }`}>
                              {(n.votes || 0).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-black/10 rounded p-4 md:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Other nominees</h2>
                  <div className="text-sm text-black text-opacity-70">
                    Count: <strong>{others.length}</strong>
                  </div>
                </div>

                {/* TABLE version — headers visually hidden for accessibility */}
                <div className="overflow-x-auto">
                  {/* <table className="min-w-full text-left">
                    <thead>
                      <tr className="sr-only">
                        <th>#</th>
                        <th>Nominee</th>
                        <th>Percentage</th>
                        <th>Votes</th>
                      </tr>
                    </thead>

                    <tbody>
                      {others.map((n, j) => {
                        const idx = safeTopCount + j + 1;
                        const pct =
                          totalVotes === 0
                            ? 0
                            : Math.round(((n.votes || 0) / totalVotes) * 100);
                        const movement = movementRef.current[n.id]?.dir;
                        return (
                          <tr
                            key={n.id}
                            className={`row-move ${
                              j % 2 === 0 ? "bg-white" : "bg-[#f1ab15]/5"
                            }`}
                            ref={(el) => {
                              nodesRef.current[n.id] = el as HTMLElement;
                            }}>
                            <td className="p-2 align-middle w-12 text-sm">
                              {idx}
                            </td>

                            <td className="p-2 align-middle min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium truncate leading-tight">
                                    {n.name}
                                  </div>
                                  <div className="text-xs text-black text-opacity-60 truncate">
                                    {n.position}
                                  </div>
                                </div>
                                <div className="text-xs font-mono text-right whitespace-nowrap">
                                  {(n.votes || 0).toLocaleString()}
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-3">
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
                                <div className="text-xs text-black text-opacity-70 w-12 text-right">
                                  {pct}%
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table> */}
                  {/* LIST version — simple, compact, clean */}
                  <ul className="space-y-2">
                    {others.map((n, j) => {
                      const idx = safeTopCount + j + 1;
                      const pct =
                        totalVotes === 0
                          ? 0
                          : Math.round(((n.votes || 0) / totalVotes) * 100);
                      const movement = movementRef.current[n.id]?.dir;
                      return (
                        <li
                          key={n.id}
                          ref={(el) => {
                            nodesRef.current[n.id] = el as HTMLElement;
                          }}
                          className={`p-2 rounded-md ${
                            j % 2 === 0 ? "bg-white" : "bg-[#f1ab15]/5"
                          } row-move`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="w-10 text-sm font-medium">
                              {idx}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium truncate leading-tight">
                                    {n.name}
                                  </div>
                                  <div className="text-xs text-black text-opacity-60 truncate">
                                    {n.position}
                                  </div>
                                </div>
                                <div className="text-xs font-mono whitespace-nowrap">
                                  {(n.votes || 0).toLocaleString()}
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-3">
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
                                <div className="text-xs text-black text-opacity-70 w-12 text-right">
                                  {pct}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          ) : (
            /* SINGLE FULL-WIDTH TABLE WHEN topCount <= 3 (no separate top panel) */
            <section className="bg-white border border-black/10 rounded p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Nominees</h2>
                <div className="text-sm text-black text-opacity-70">
                  Total votes: <strong>{totalVotes.toLocaleString()}</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-xs text-black text-opacity-70">
                      <th className="p-3 w-12">#</th>
                      <th className="p-3">Nominee</th>
                      <th className="p-3 w-48">Percentage</th>
                      <th className="p-3 text-right w-36">Votes</th>
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
                      return (
                        <tr
                          key={n.id}
                          className={`row-move ${
                            i % 2 === 0 ? "bg-white" : "bg-[#f1ab15]/5"
                          }`}
                          ref={(el) => {
                            nodesRef.current[n.id] = el as HTMLElement;
                          }}>
                          <td className="p-3">{rank}</td>
                          <td
                            className={`p-3 ${
                              movement === "up"
                                ? "row-up"
                                : movement === "down"
                                ? "row-down"
                                : ""
                            }`}>
                            <div className="font-medium">{n.name}</div>
                            <div className="text-xs text-black text-opacity-60">
                              {n.position}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
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
                              <div className="text-sm text-black text-opacity-70 w-12 text-right">
                                {pct}%
                              </div>
                            </div>
                          </td>
                          <td
                            className={`p-3 text-right font-mono ${
                              movement === "up"
                                ? "text-up"
                                : movement === "down"
                                ? "text-down"
                                : ""
                            }`}>
                            {(n.votes || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
