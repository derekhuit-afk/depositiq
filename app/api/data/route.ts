import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const SAMPLE_DATA = [{"bank_name":"First National Bank","state":"TX","total_deposits":4820000000,"loan_to_deposit_ratio":0.84,"deposit_concentration":0.68,"yoy_deposit_growth":0.124,"brokered_deposit_pct":0.08,"cd_pct":0.31,"checking_pct":0.42,"savings_pct":0.19,"fdic_rating":"Well-Capitalized"},{"bank_name":"Heartland Community Bank","state":"IA","total_deposits":892000000,"loan_to_deposit_ratio":0.76,"deposit_concentration":0.54,"yoy_deposit_growth":0.031,"brokered_deposit_pct":0.03,"cd_pct":0.44,"checking_pct":0.38,"savings_pct":0.15,"fdic_rating":"Well-Capitalized"},{"bank_name":"Pacific Coast Savings","state":"CA","total_deposits":2140000000,"loan_to_deposit_ratio":0.91,"deposit_concentration":0.72,"yoy_deposit_growth":-0.042,"brokered_deposit_pct":0.14,"cd_pct":0.28,"checking_pct":0.47,"savings_pct":0.11,"fdic_rating":"Adequately-Capitalized"}];

function getStats(data: Record<string, unknown>[]) {
  if (!data || data.length === 0) return {};
  const numericKeys = Object.keys(data[0]).filter(k => typeof data[0][k] === "number");
  const stats: Record<string, unknown> = { total_records: data.length };
  numericKeys.slice(0, 2).forEach(k => {
    const avg = data.reduce((s, r) => s + (Number(r[k]) || 0), 0) / data.length;
    stats[`avg_${k}`] = Math.round(avg * 100) / 100;
  });
  return stats;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  
  let data = SAMPLE_DATA as Record<string, unknown>[];
  if (q) {
    data = data.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
    );
  }
  
  return NextResponse.json({
    data,
    stats: getStats(data),
    refreshed: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const data = SAMPLE_DATA as Record<string, unknown>[];
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const csv = [
    headers.join(","),
    ...data.map(r => headers.map(h => String(r[h] ?? "")).join(","))
  ].join("\n");
  
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=depositiq-export.csv`
    }
  });
}
