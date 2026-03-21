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
    // Full-screen fixed container — avoids ALL height inheritance issues on iOS
    <div style={{
      position: "fixed",
      inset: 0,
      background: isFeed ? "#000" : "#0a0a0a",
      color: "#f1f5f9",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Header — overlaid (transparent) on feed, solid on other tabs */}
      <div style={{
        position: isFeed ? "absolute" : "relative",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        paddingTop: "env(safe-area-inset-top)",
        background: isFeed ? "transparent" : "rgba(10,10,10,0.95)",
        backdropFilter: isFeed ? "none" : "blur(12px)",
        borderBottom: isFeed ? "none" : "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", height: 50 }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>英语打卡</span>
            <nav style={{ display: "flex", marginLeft: "auto", gap: 2 }}>
              {tabs.map(({ id, label }) => {
                const active = activeTab === id;
                return (
                  <button key={id} onClick={() => setActiveTab(id)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "none",
                    background: active ? "rgba(255,255,255,0.15)" : "none",
                    color: active ? "#fff" : "rgba(255,255,255,0.45)",
                    fontWeight: active ? 600 : 400, fontSize: 14,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content area */}
      {isFeed ? (
        // Feed is absolute and covers the whole screen
        <Feed />
      ) : (
        <div style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          WebkitOverflowScrolling: "touch",
        }}>
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
