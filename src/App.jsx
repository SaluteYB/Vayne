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
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
      background: isFeed ? "#000" : "#0a0a0a",
      color: "#f1f5f9",
    }}>
      {/* Top header */}
      <header style={{
        flexShrink: 0,
        paddingTop: "env(safe-area-inset-top)",
        background: isFeed ? "transparent" : "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: isFeed ? "none" : "1px solid rgba(255,255,255,0.08)",
        position: isFeed ? "absolute" : "relative",
        top: 0, left: 0, right: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", height: 50 }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: isFeed ? "white" : "#f1f5f9" }}>
              英语打卡
            </span>
            <nav style={{ display: "flex", marginLeft: "auto", gap: 2 }}>
              {tabs.map(({ id, label }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: active
                        ? isFeed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"
                        : "none",
                      color: active ? "#f1f5f9" : isFeed ? "rgba(255,255,255,0.6)" : "#6b7280",
                      fontWeight: active ? 600 : 400,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{
        flex: 1,
        overflow: "hidden",
        minHeight: 0,
        // For non-feed pages, add top padding so content isn't under the header
        ...(isFeed ? {} : { paddingTop: 0 }),
      }}>
        {activeTab === "feed" && <Feed />}
        {activeTab !== "feed" && (
          <div style={{ height: "100%", overflowY: "auto", maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
            {activeTab === "typing" && <Typing />}
            {activeTab === "checkin" && <CheckIn />}
            {activeTab === "profile" && <Profile />}
          </div>
        )}
      </main>
    </div>
  );
}
