import { useState, useRef, useCallback } from "react";
import VideoCard from "./components/VideoCard";
import Typing from "./components/Typing";
import CheckIn from "./components/CheckIn";
import Profile from "./components/Profile";
import RealEstate from "./components/RealEstate";
import { posts } from "./data/content";
import "./index.css";

const NAV = [
  { id: "feed",       label: "学习" },
  { id: "typing",     label: "打字" },
  { id: "checkin",    label: "打卡" },
  { id: "realestate", label: "房产" },
  { id: "profile",    label: "我的" },
];

// Infinite feed — repeat posts 60 times (~480 cards)
const FEED = Array.from({ length: 60 }, (_, i) => ({
  ...posts[i % posts.length],
  _feedIdx: i,
}));

export default function App() {
  const [tab, setTab] = useState("feed");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const tickRef = useRef(false);
  const isFeed = tab === "feed";

  const handleScroll = useCallback(() => {
    if (tickRef.current) return;
    tickRef.current = true;
    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (el) setActiveIndex(Math.round(el.scrollTop / el.clientHeight));
      tickRef.current = false;
    });
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#080808", overflow: "hidden" }}>

      {/* ── FEED ── */}
      {isFeed && (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            position: "absolute", inset: 0,
            overflowY: "scroll", overflowX: "hidden",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {FEED.map((post, i) => (
            <div
              key={post._feedIdx}
              style={{
                width: "100%", height: "100vh",
                scrollSnapAlign: "start", scrollSnapStop: "always",
                overflow: "hidden",
              }}
            >
              <VideoCard post={post} isActive={i === activeIndex} cardIndex={i} />
            </div>
          ))}
        </div>
      )}

      {/* ── OTHER TABS ── */}
      {!isFeed && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", color: "#fff" }}>
          <div style={{
            flexShrink: 0, height: 50,
            paddingTop: "env(safe-area-inset-top)",
            background: "rgba(8,8,8,0.98)",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", padding: "0 20px",
          }}>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.5 }}>
              {tab === "realestate" ? "趋势房产" : "英语打卡"}
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 32px" }}>
              {tab === "typing"      && <Typing />}
              {tab === "checkin"     && <CheckIn />}
              {tab === "realestate"  && <RealEstate />}
              {tab === "profile"     && <Profile />}
            </div>
          </div>
        </div>
      )}

      {/* ── NAV (always on top) ── */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 200,
        paddingTop: "env(safe-area-inset-top)",
        background: isFeed
          ? "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)"
          : "transparent",
        pointerEvents: "none",
      }}>
        <div style={{
          height: 50, display: "flex", alignItems: "center",
          padding: "0 20px", pointerEvents: "auto",
        }}>
          <span style={{
            fontWeight: 700, fontSize: 16, letterSpacing: -0.5,
            color: "#fff", marginRight: "auto",
          }}>
            英语打卡
          </span>
          <div style={{
            display: "flex", gap: 2, padding: "3px",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderRadius: 12,
          }}>
            {NAV.map(({ id, label }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding: "5px 13px", borderRadius: 9, border: "none",
                  background: active ? "rgba(255,255,255,0.18)" : "none",
                  color: active ? "#fff" : "rgba(255,255,255,0.4)",
                  fontWeight: active ? 600 : 400, fontSize: 13, cursor: "pointer",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
