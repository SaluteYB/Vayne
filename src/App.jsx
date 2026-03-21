import { useState } from "react";
import { BookOpen, Keyboard, Flame, User } from "lucide-react";
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

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f1f5f9" }}>
      {/* Top header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", height: 52 }}>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px", color: "#f1f5f9" }}>
              英语打卡
            </span>
            <nav style={{ display: "flex", marginLeft: "auto", gap: 4 }}>
              {tabs.map(({ id, label }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: active ? "rgba(255,255,255,0.1)" : "none",
                      color: active ? "#f1f5f9" : "#6b7280",
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

      {/* Page content */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        {activeTab === "feed" && <Feed />}
        {activeTab === "typing" && <Typing />}
        {activeTab === "checkin" && <CheckIn />}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
}
