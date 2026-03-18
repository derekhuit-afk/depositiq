'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DataRow {
  [key: string]: string | number | boolean | null;
}

export default function Dashboard() {
  const [data, setData] = useState<DataRow[]>([]);
  const [stats, setStats] = useState<Record<string, string | number>>({}); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshed, setRefreshed] = useState("");
  const router = useRouter();

  async function fetchData() {
    setLoading(true);
    const params = search ? `?q=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/data${params}`);
    if (res.status === 401) { router.push("/login"); return; }
    const json = await res.json();
    setData(json.data || []);
    setStats(json.stats || {});
    setRefreshed(json.refreshed || "");
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, [search]);

  async function exportCSV() {
    const res = await fetch("/api/data", { method: "POST" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "depositiq-export.csv"; a.click();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const columns = data.length > 0 ? Object.keys(data[0]).slice(0, 8) : [];
  const statKeys = Object.keys(stats).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "#050A07" }}>
      <nav style={{ borderBottom: "1px solid #1E2235", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: "18px", color: "#00FF88" }}>DepositIQ</div>
          <div style={{ fontSize: "10px", color: "#4B5563", letterSpacing: "2px", textTransform: "uppercase" }}>Insurance & Underwriting</div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {refreshed && <div style={{ fontSize: "11px", color: "#4B5563" }}>Updated {new Date(refreshed).toLocaleDateString()}</div>}
          <button onClick={exportCSV} style={{ background: "transparent", border: "1px solid #1E2235", color: "#6B7280", padding: "6px 16px", cursor: "pointer", fontSize: "12px" }}>Export CSV</button>
          <button onClick={logout} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "12px" }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: "32px" }}>
        {/* Stats */}
        {statKeys.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(statKeys.length, 4)}, 1fr)`, gap: "16px", marginBottom: "32px" }}>
            {statKeys.map(k => (
              <div key={k} style={{ background: "#080C1A", border: "1px solid #1E2235", padding: "20px 24px" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#00FF88" }}>{String(stats[k])}</div>
                <div style={{ fontSize: "10px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>{k.replace(/_/g, " ")}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Search records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "#080C1A", border: "1px solid #1E2235", color: "#E8EAF0", padding: "10px 16px", fontSize: "13px", outline: "none", width: "300px" }}
          />
        </div>

        {/* Data Table */}
        <div style={{ border: "1px solid #1E2235", background: "#080C1A", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1E2235" }}>
                {columns.map(col => (
                  <th key={col} style={{ padding: "12px 16px", textAlign: "left", color: "#6B7280", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {col.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length || 6} style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={columns.length || 6} style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>No records found</td></tr>
              ) : data.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #0F1420", background: i % 2 === 0 ? "#080C1A" : "#0A0E1C" }}>
                  {columns.map(col => (
                    <td key={col} style={{ padding: "10px 16px", color: "#9CA3AF", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {String(row[col] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "12px", fontSize: "11px", color: "#4B5563" }}>
          {data.length} records displayed · DepositIQ Intelligence Platform · Huit Data Ventures
        </div>
      </div>
    </div>
  );
}
