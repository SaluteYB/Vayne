import { useState } from "react";
import Feed from "./components/Feed";
import Typing from "./components/Typing";
import CheckIn from "./components/CheckIn";
import Profile from "./components/Profile";
import "./index.css";

const NAV = [
  { id: "feed",    label: "学习" },
  { id: "typing",  label: "打字" },
  { id: "checkin", label: "打卡" },
  { id: "profile", label: "我的" },
];

export default function App() {
  const [tab, setTab] = useState("feed");
  const isFeed = tab === "feed";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#080808", color: "#fff" }}>

      {/* ── Top nav ── */}
      <nav style={{
        flexShrink: 0,
        position: isFeed ? "fixed" : "relative",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        paddingTop: "env(safe-area-inset-top)",
        background: isFeed
          ? "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)"
          : "rgba(8,8,8,0.97)",
        borderBottom: isFeed ? "none" : "0.5px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", height: 50,
          padding: "0 20px", gap: 0,
        }}>
          {/* Wordmark */}
          <div style={{
            fontSize: 16, fontWeight: 700, letterSpacing: -0.5,
            color: "#fff",
            fontFamily: '-apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif',
            marginRight: "auto",
          }}>
            英语打卡
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, padding: "3px", background: "rgba(255,255,255,0.06)", borderRadius: 12 }}>
            {NAV.map(({ id, label }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding: "5px 13px", borderRadius: 9, border: "none",
                  background: active ? "rgba(255,255,255,0.13)" : "none",
                  color: active ? "#fff" : "rgba(255,255,255,0.38)",
                  fontWeight: active ? 600 : 400,
                  fontSize: 13, letterSpacing: 0.2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif',
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      {isFeed ? (
        <Feed />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 32px" }}>
            {tab === "typing"  && <Typing />}
            {tab === "checkin" && <CheckIn />}
            {tab === "profile" && <Profile />}
          </div>
        </div>
      )}
    </div>
  );
}
