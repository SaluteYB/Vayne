import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, MapPin, BarChart2, Activity, ChevronRight } from "lucide-react";
import { CITIES, PRICE_HISTORY, MONTHS, HOT_AREAS, MARKET } from "../data/realEstateData";

const ACCENT = "#f59e0b";

// ── SVG sparkline area chart ──────────────────────────────────────────────────
function Sparkline({ data, color, height = 72 }) {
  const W = 300;
  const H = height;
  const PAD = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - (v - min) / range) * (H - PAD * 2 - 8),
  }));

  // smooth bezier
  const line = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const prev = pts[i - 1];
      const cx = ((prev.x + p.x) / 2).toFixed(1);
      return `C ${cx} ${prev.y.toFixed(1)} ${cx} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");

  const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;
  const gId = `sg-${color.replace(/[^a-z0-9]/gi, "")}`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* last point dot */}
      <circle cx={last.x} cy={last.y} r="3.5" fill={color} />
      <circle cx={last.x} cy={last.y} r="6" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// ── Market sentiment arc gauge ────────────────────────────────────────────────
function SentimentGauge({ score, label }) {
  const R = 54;
  const CX = 70;
  const CY = 68;
  const totalArc = Math.PI; // 180°
  const pct = score / 100;
  const angle = Math.PI + totalArc * pct; // start at left
  const x = CX + R * Math.cos(angle);
  const y = CY + R * Math.sin(angle);
  const trackD = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
  const fillD = `M ${CX - R} ${CY} A ${R} ${R} 0 ${pct > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;

  const scoreColor =
    score >= 70 ? "#22c55e" : score >= 50 ? ACCENT : "#ef4444";

  return (
    <svg viewBox="0 0 140 80" style={{ width: 140, height: 80 }}>
      {/* track */}
      <path d={trackD} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
      {/* fill */}
      <path d={fillD} fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round" />
      {/* score text */}
      <text x={CX} y={CY - 2} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700">
        {score}
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" fill={scoreColor} fontSize="11" fontWeight="600">
        {label}
      </text>
      {/* labels */}
      <text x="4"   y={CY + 4} fill="rgba(255,255,255,0.25)" fontSize="9">熊</text>
      <text x="122" y={CY + 4} fill="rgba(255,255,255,0.25)" fontSize="9">牛</text>
    </svg>
  );
}

// ── Trend tab ─────────────────────────────────────────────────────────────────
function TrendTab({ city }) {
  const data = PRICE_HISTORY[city];
  const current = data[data.length - 1];
  const prev = data[0];
  const change = (((current - prev) / prev) * 100).toFixed(1);
  const up = current >= prev;

  const monthChange = (((current - data[data.length - 2]) / data[data.length - 2]) * 100).toFixed(2);
  const upMonth = parseFloat(monthChange) >= 0;

  const fmtPrice = (v) =>
    v >= 10000 ? (v / 10000).toFixed(2) + "万" : v.toLocaleString();

  const lineColor = up ? "#22c55e" : "#ef4444";

  return (
    <div style={{ padding: "16px 0 8px" }}>
      {/* Hero price card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "20px 20px 0", marginBottom: 16,
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.8, marginBottom: 4 }}>
              二手房均价（元/㎡）
            </div>
            <div style={{ fontSize: 36, fontWeight: "800", color: "#fff", letterSpacing: -1, lineHeight: 1 }}>
              {fmtPrice(current)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              background: up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              border: `1px solid ${up ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: 8, padding: "4px 10px", marginBottom: 6,
            }}>
              {up
                ? <TrendingUp size={13} color="#22c55e" />
                : <TrendingDown size={13} color="#ef4444" />}
              <span style={{ fontSize: 13, fontWeight: 700, color: up ? "#22c55e" : "#ef4444" }}>
                {up ? "+" : ""}{change}%
              </span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
              近12个月涨跌
            </div>
          </div>
        </div>

        {/* Month-on-month */}
        <div style={{ display: "flex", gap: 20, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 12 }}>
          <StatMini label="环比" value={`${upMonth ? "+" : ""}${monthChange}%`} color={upMonth ? "#22c55e" : "#ef4444"} />
          <StatMini label="最低价" value={fmtPrice(Math.min(...data))} color="rgba(255,255,255,0.5)" />
          <StatMini label="最高价" value={fmtPrice(Math.max(...data))} color="rgba(255,255,255,0.5)" />
        </div>

        {/* Chart */}
        <div style={{ margin: "0 -20px" }}>
          <Sparkline data={data} color={lineColor} height={80} />
        </div>

        {/* Month labels */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "4px 0 12px", margin: "0",
        }}>
          {[0, 2, 4, 6, 8, 10, 11].map((i) => (
            <span key={i} style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
              {MONTHS[i]}
            </span>
          ))}
        </div>
      </div>

      {/* City comparison mini table */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, overflow: "hidden",
      }}>
        <div style={{
          padding: "12px 16px 8px",
          fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)",
          letterSpacing: 1, textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
        }}>
          <span style={{ flex: 1 }}>城市</span>
          <span style={{ width: 80, textAlign: "right" }}>均价</span>
          <span style={{ width: 60, textAlign: "right" }}>12月涨跌</span>
        </div>
        {CITIES.map((c) => {
          const d = PRICE_HISTORY[c.id];
          const cur = d[d.length - 1];
          const chg = (((cur - d[0]) / d[0]) * 100).toFixed(1);
          const isUp = parseFloat(chg) >= 0;
          const isSelected = c.id === city;
          return (
            <div key={c.id} style={{
              display: "flex", alignItems: "center",
              padding: "10px 16px",
              background: isSelected ? "rgba(245,158,11,0.06)" : "transparent",
              borderLeft: isSelected ? `2px solid ${ACCENT}` : "2px solid transparent",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{
                flex: 1, fontSize: 14, fontWeight: isSelected ? 700 : 400,
                color: isSelected ? ACCENT : "rgba(255,255,255,0.75)",
              }}>{c.name}</span>
              <span style={{ width: 80, textAlign: "right", fontSize: 13, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                {fmtPrice(cur)}
              </span>
              <span style={{
                width: 60, textAlign: "right", fontSize: 12, fontWeight: 600,
                color: isUp ? "#22c55e" : "#ef4444",
                fontVariantNumeric: "tabular-nums",
              }}>
                {isUp ? "+" : ""}{chg}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatMini({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

// ── Hot areas tab ─────────────────────────────────────────────────────────────
function HotTab({ city }) {
  const areas = HOT_AREAS[city];
  const maxVol = Math.max(...areas.map((a) => a.vol));

  return (
    <div style={{ padding: "16px 0 8px" }}>
      {/* Header labels */}
      <div style={{
        display: "flex", padding: "0 4px 8px",
        fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: 0.8,
      }}>
        <span style={{ width: 28 }}>#</span>
        <span style={{ flex: 1 }}>板块</span>
        <span style={{ width: 72, textAlign: "right" }}>均价(元/㎡)</span>
        <span style={{ width: 52, textAlign: "right" }}>月涨跌</span>
      </div>

      {areas.map((area, i) => {
        const up = area.change >= 0;
        const heatPct = (area.vol / maxVol) * 100;
        return (
          <div key={area.name} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "14px 14px 12px",
            marginBottom: 10, position: "relative", overflow: "hidden",
          }}>
            {/* heat bar background */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${heatPct}%`,
              background: up
                ? "linear-gradient(to right, rgba(34,197,94,0.06), transparent)"
                : "linear-gradient(to right, rgba(239,68,68,0.06), transparent)",
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              {/* rank */}
              <span style={{
                width: 26, fontSize: 13, fontWeight: 800,
                color: i < 3 ? ACCENT : "rgba(255,255,255,0.2)",
              }}>
                {i + 1}
              </span>

              {/* name + volume bar */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 5 }}>
                  {area.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    height: 3, borderRadius: 2,
                    width: `${heatPct * 0.7}%`, minWidth: 12, maxWidth: "70%",
                    background: up ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)",
                  }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                    成交{area.vol.toLocaleString()}套
                  </span>
                </div>
              </div>

              {/* price */}
              <div style={{ width: 72, textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                  {area.price >= 10000
                    ? (area.price / 10000).toFixed(1) + "万"
                    : area.price.toLocaleString()}
                </div>
              </div>

              {/* change */}
              <div style={{
                width: 52, textAlign: "right",
                display: "flex", flexDirection: "column", alignItems: "flex-end",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 2,
                }}>
                  {up
                    ? <TrendingUp size={11} color="#22c55e" />
                    : <TrendingDown size={11} color="#ef4444" />}
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: up ? "#22c55e" : "#ef4444",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {up ? "+" : ""}{area.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Market tab ────────────────────────────────────────────────────────────────
function MarketTab({ city }) {
  const m = MARKET[city];
  const signalColor =
    m.signal === "做多" ? "#22c55e" : m.signal === "做空" ? "#ef4444" : ACCENT;

  return (
    <div style={{ padding: "16px 0 8px" }}>
      {/* Sentiment gauge card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "20px", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.8, marginBottom: 8 }}>
            市场情绪指数
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${signalColor}18`,
            border: `1px solid ${signalColor}40`,
            borderRadius: 10, padding: "6px 14px",
          }}>
            <Activity size={14} color={signalColor} />
            <span style={{ fontSize: 14, fontWeight: 800, color: signalColor, letterSpacing: 0.5 }}>
              {m.signal}信号
            </span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
            吸筹率 <span style={{ color: "#fff", fontWeight: 600 }}>{m.absorb}</span>
          </div>
        </div>
        <SentimentGauge score={m.sentiment} label={m.label} />
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatCard label="挂牌总量" value={m.listings.toLocaleString()} unit="套" icon={<MapPin size={14} color={ACCENT} />} />
        <StatCard label="月成交量" value={m.sold.toLocaleString()} unit="套" icon={<BarChart2 size={14} color="#38bdf8" />} accent="#38bdf8" />
        <StatCard label="平均在售天数" value={m.avgDOM} unit="天" icon={<Activity size={14} color="#a78bfa" />} accent="#a78bfa" />
        <StatCard label="降价比例" value={m.pricecut} unit="%" icon={<TrendingDown size={14} color="#f87171" />} accent="#f87171" />
      </div>

      {/* New listings */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, padding: "16px",
      }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginBottom: 12, fontWeight: 700 }}>
          本月新增挂牌
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>
            {m.newListings.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>套</span>
          <span style={{
            marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            查看挂牌详情 <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
          </span>
        </div>
        {/* simple bar */}
        <div style={{ marginTop: 14, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${(m.newListings / 5000) * 100}%`,
            background: `linear-gradient(to right, ${ACCENT}, ${ACCENT}80)`,
          }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, accent = ACCENT }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "14px 14px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        {icon}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        <span style={{ fontSize: 12, color: accent }}>{unit}</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const SUB_TABS = [
  { id: "trend",  label: "趋势" },
  { id: "hot",    label: "热点" },
  { id: "market", label: "行情" },
];

export default function RealEstate() {
  const [city, setCity] = useState("sh");
  const [tab, setTab]   = useState("trend");

  const cityName = CITIES.find((c) => c.id === city)?.name ?? "";

  return (
    <div style={{ minHeight: "100%", paddingBottom: 32 }}>
      {/* City selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex", gap: 8,
          overflowX: "auto", scrollbarWidth: "none",
          paddingBottom: 2,
        }}>
          {CITIES.map((c) => {
            const selected = c.id === city;
            return (
              <button
                key={c.id}
                onClick={() => setCity(c.id)}
                style={{
                  flexShrink: 0,
                  padding: "6px 16px", borderRadius: 20, border: "none",
                  background: selected ? ACCENT : "rgba(255,255,255,0.07)",
                  color: selected ? "#000" : "rgba(255,255,255,0.5)",
                  fontSize: 13, fontWeight: selected ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab nav */}
      <div style={{
        display: "flex", gap: 0,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12, padding: 3, marginBottom: 4,
      }}>
        {SUB_TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 9, border: "none",
                background: active ? "rgba(255,255,255,0.12)" : "none",
                color: active ? "#fff" : "rgba(255,255,255,0.35)",
                fontSize: 13, fontWeight: active ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "trend"  && <TrendTab  city={city} />}
      {tab === "hot"    && <HotTab    city={city} />}
      {tab === "market" && <MarketTab city={city} />}
    </div>
  );
}
