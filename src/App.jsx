import { useState } from "react";
import Feed from "./components/Feed";
import Typing from "./components/Typing";
import CheckIn from "./components/CheckIn";
import Profile from "./components/Profile";
import "./index.css";

const tabs = [
  { id: "feed", label: "学习" },
  { id: "typing", label: "打字" },
  { id: "checkin", label: "打卡" },
  { id: "profile", label: "我的" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("feed");
  const isFeed = activeTab === "feed";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0a", color: "#fff" }}>

      {/* Nav header — overlays feed, solid on other pages */}
      <nav style={{
        flexShrink: 0,
        position: isFeed ? "fixed" : "relative",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        paddingTop: "env(safe-area-inset-top)",
        background: isFeed
          ? "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)"
          : "rgba(15,15,15,0.98)",
        borderBottom: isFeed ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", height: 50, maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>英语打卡</span>
          <div style={{ display: "flex", marginLeft: "auto", gap: 2 }}>
            {tabs.map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  padding: "6px 12px", borderRadius: 8, border: "none",
                  background: active ? "rgba(255,255,255,0.18)" : "none",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  fontWeight: active ? 600 : 400, fontSize: 14,
                  cursor: "pointer",
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page content */}
      {isFeed ? (
        <Feed />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
            {activeTab === "typing" && <Typing />}
            {activeTab === "checkin" && <CheckIn />}
            {activeTab === "profile" && <Profile />}
          </div>
        </div>
      )}
    </div>
  );
}
